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
      const gasPrice = await web3.eth.getGasPrice();
      // const contractAddress = "0x027E6C639eCC0dDB9487cc5Db53905FcEe177cC4";
      // Create the transaction object with legacy gas pricing
      const tx = {
        from: account,
        to: contractAddress,
        gas: 200000,           // Estimate the required gas limit
        gasPrice: gasPrice,    // Legacy gas pricing, non-EIP-1559
        data: contractInstance.methods.changeStatusToAccepted(custAddress).encodeABI(), // Encoded method call
      };

      // Send the transaction
      await web3.eth.sendTransaction(tx);
      // await contractInstance.methods.changeStatusToAccepted(custAddress).send({ from: account });
      alert("Request accepted!");
      fetchRequests(); // Refresh the requests list
    } catch (error) {
      console.error("Failed to accept request:", error);
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
    <div className="organisation-dashboard">
      <h2 className="header">Organisation Dashboard</h2>
      {requests.length > 0 ? (
        requests.map((custAddress) => (
          <div className="request-card" key={custAddress}>
            <h4>Customer Address: {custAddress}</h4>
            <div className="action-buttons">
              <button className="accept-button" onClick={() => acceptRequest(custAddress)}>Accept</button>
              <button className="reject-button" onClick={() => rejectRequest(custAddress)}>Reject</button>
            </div>
          </div>
        ))
      ) : (
        <p>No pending requests.</p>
      )}
    </div>
  );
}
