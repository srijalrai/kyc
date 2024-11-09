import React, { useState, useEffect } from 'react';
import '../styles/CustomerDashboard.css';
import '../styles/Common.css';

export default function CustomerDashboard({ contract, account }) {
  const [status, setStatus] = useState(null);

  const fetchStatus = async () => {
    try {
      const result = await contract.methods.checkStatus().call({ from: account });
      setStatus(result);
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [contract, account]);

  const getStatusLabel = (statusCode) => {
    switch (statusCode) {
      case "0":
        return "Accepted";
      case "1":
        return "Rejected";
      default:
        return "Pending";
    }
  };

  return (
    <div className="customer-dashboard">
      <h2 className="header">Customer Dashboard</h2>
      <p className="status-text">KYC Status: {status !== null ? getStatusLabel(status) : "Loading..."}</p>
      <button className="refresh-button" onClick={fetchStatus}>Refresh Status</button>
    </div>
  );
}
