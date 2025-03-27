import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import KycContractABI from '../kycContractABI.json';
import '../styles/OrganisationRegistration.css';
import '../styles/Common.css';

export default function OrganisationRegistration({ contractInstance, web3, account, contractAddress }) {
  const [orgName, setOrgName] = useState('');

  const registerOrganisation = async () => {
    if (!contractInstance) {
      alert("Contract is not properly initialized.");
      return;
    }

    try {
        const gasPrice = await web3.eth.getGasPrice();
        // const contractAddress = "0x027E6C639eCC0dDB9487cc5Db53905FcEe177cC4";

        // Create the transaction object with Ether value
        const tx = {
          from: account,
          to: contractAddress,
          gas: 200000,           
          gasPrice: gasPrice,    
          value: Web3.utils.toWei('1', 'ether'),  // Sending 1 Ether as required by the contract
          data: contractInstance.methods.newOrganisation(orgName).encodeABI(), 
        };

        // Send the transaction
        await web3.eth.sendTransaction(tx);
        const isRegistered = await contractInstance.methods.isOrg().call({ from: account });
        console.log("Is Organisation Registered?", isRegistered);
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
