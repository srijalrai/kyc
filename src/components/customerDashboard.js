import React, { useState, useEffect } from 'react';
import '../styles/CustomerDashboard.css';
import '../styles/Common.css';

export default function CustomerDashboard({ contractInstance, account }) {
  const [status, setStatus] = useState(null);

  const fetchStatus = async () => {
    try {
      const result = await contractInstance.methods.checkStatus().call({ from: account });
      setStatus(Number(result));
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [contractInstance, account]);

  const getStatusLabel = (statusCode) => {
    switch (statusCode) {
      case 0:
        return "Accepted";
      case 1:
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
