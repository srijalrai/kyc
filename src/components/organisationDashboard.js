import React, { useState, useEffect } from 'react';
import '../styles/OrganisationDashboard.css';
import '../styles/Common.css';

export default function OrganisationDashboard({ contractInstance, web3, account, contractAddress }) {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const requestList = await contractInstance.methods.viewRequests().call({ from: account, gas: 500000 });
      setRequests(requestList);
      console.log(requestList);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    }
  };

  const acceptRequest = async (custAddress) => {
    try {
      // Get current accepted banks count
      const currentCount = await contractInstance.methods
        .getAcceptedBanksCount(custAddress)
        .call();

      // Calculate required fee in wei (1 ETH / (n+1))
      const requiredWei = (1e18 / (parseInt(currentCount) + 1)).toString();

      // EIP-1559 transaction parameters
      const gasPrice = await web3.eth.getGasPrice();
      // const block = await web3.eth.getBlock("latest");
      // const maxPriorityFeePerGas = web3.utils.toWei('2', 'gwei');
      // const maxFeePerGas = Math.min(
      //   block.baseFeePerGas * 2 + maxPriorityFeePerGas,
      //   web3.utils.toWei('100', 'gwei')
      // ).toString();



      await contractInstance.methods
        .changeStatusToAccepted(custAddress)
        .send({
          from: account,
          value: requiredWei,
          gasPrice: gasPrice,
          gas: 500000
        });

      alert("Request accepted! Verification fee processed");
      fetchRequests();
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };


  const rejectRequest = async (custAddress) => {
    try {
      const gasPrice = await web3.eth.getGasPrice();
      // const contractAddress = "0x027E6C639eCC0dDB9487cc5Db53905FcEe177cC4";
      // Create the transaction object with legacy gas pricing
      const tx = {
        from: account,
        to: contractAddress,
        gas: 200000,           // Estimate the required gas limit
        gasPrice: gasPrice,    // Legacy gas pricing, non-EIP-1559
        data: contractInstance.methods.changeStatusToRejected(custAddress).encodeABI(), // Encoded method call
      };

      // Send the transaction
      await web3.eth.sendTransaction(tx);
      // await contractInstance.methods.changeStatusToRejected(custAddress).send({ from: account });
      alert("Request rejected!");
      fetchRequests(); // Refresh the requests list
    } catch (error) {
      console.error("Failed to reject request:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [contractInstance, account]);

  return (
    // <div className="organisation-dashboard">
    //   <h2 className="header">Organisation Dashboard</h2>
    //   {requests.length > 0 ? (
    //     requests.map((custAddress) => (
    //       <div className="request-card" key={custAddress}>
    //         <h4>Customer Address: {custAddress}</h4>
    //         <div className="action-buttons">
    //           <button className="accept-button" onClick={() => acceptRequest(custAddress)}>Accept</button>
    //           <button className="reject-button" onClick={() => rejectRequest(custAddress)}>Reject</button>
    //         </div>
    //       </div>
    //     ))
    //   ) : (
    //     <p>No pending requests.</p>
    //   )}
    // </div>

    <div className="organisation-dashboard">
      <h2 className="header">Organisation Dashboard</h2>
      {requests.length > 0 ? (
        requests.map((request) => (
          <div className="request-card" key={request.customerAddress}>
            <div className="customer-info">
              <h3>{request.name}</h3>
              <p className="customer-detail">
                <span className="detail-label">Aadhar:</span>
                {request.aadhar}
              </p>
              <p className="customer-detail">
                <span className="detail-label">PAN:</span>
                {request.pan}
              </p>
              <p className="customer-address">
                Address: {request.customerAddress}
              </p>
            </div>
            <div className="action-buttons">
              <button
                className="accept-button"
                onClick={() => acceptRequest(request.customerAddress)}
              >
                Accept
              </button>
              <button
                className="reject-button"
                onClick={() => rejectRequest(request.customerAddress)}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="no-requests">No pending requests.</p>
      )}
    </div>

  );
}
