import React, { useState, useEffect } from 'react';
import '../styles/OrganisationDashboard.css';
import '../styles/Common.css';

export default function OrganisationDashboard({ contract, account }) {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const requestList = await contract.methods.viewRequests().call({ from: account });
      setRequests(requestList);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    }
  };

  const acceptRequest = async (custAddress) => {
    try {
      await contract.methods.changeStatusToAccepted(custAddress).send({ from: account });
      alert("Request accepted!");
      fetchRequests(); // Refresh the requests list
    } catch (error) {
      console.error("Failed to accept request:", error);
    }
  };

  const rejectRequest = async (custAddress) => {
    try {
      await contract.methods.changeStatusToRejected(custAddress).send({ from: account });
      alert("Request rejected!");
      fetchRequests(); // Refresh the requests list
    } catch (error) {
      console.error("Failed to reject request:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [contract, account]);

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
