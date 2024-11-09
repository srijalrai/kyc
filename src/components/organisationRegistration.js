import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import KycContractABI from '../kycContractABI.json';
import '../styles/OrganisationRegistration.css';
import '../styles/Common.css';

export default function OrganisationRegistration({ contractInstance, web3, account }) {
  const [orgName, setOrgName] = useState('');

  const registerOrganisation = async () => {
    if (!contractInstance) {
      alert("Contract is not properly initialized.");
      return;
    }

    try {
        const gasPrice = await web3.eth.getGasPrice();
        const contractAddress = "0x3ca2560903380f3822aba98FA93F28293F0D6066";
        // Create the transaction object with legacy gas pricing
        const tx = {
          from: account,
          to: contractAddress,
          gas: 200000,           // Estimate the required gas limit
          gasPrice: gasPrice,    // Legacy gas pricing, non-EIP-1559
          data: contractInstance.methods.newOrganisation(orgName).encodeABI(), // Encoded method call
        };
  
        // Send the transaction
        await web3.eth.sendTransaction(tx);
        alert("Organisation registered successfully!");
    } catch (error) {
      alert("Registration failed: " + error.message);
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="organisation-registration">
      <h2 className="header">Organisation Registration</h2>
      <input
        className="input-field"
        placeholder="Organisation Name"
        value={orgName}
        onChange={(e) => setOrgName(e.target.value)}
      />
      <button className="submit-button" onClick={registerOrganisation}>Register</button>
    </div>
  );
}
