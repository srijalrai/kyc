import React, { useState } from 'react';
import '../styles/CustomerRegistration.css';
import '../styles/Common.css';

export default function CustomerRegistration({ contractInstance, web3, account, contractAddress }) {
  const [name, setName] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [pan, setPan] = useState('');
  const [bankAddress, setBankAddress] = useState('');

  const registerCustomer = async () => {
    if (!contractInstance) {
      alert("Contract is not properly initialized.");
      return;
    }

    try {
        const gasPrice = await web3.eth.getGasPrice();
        // const contractAddress = "0x57062b840B7f790ff8A98cd8159922Ed9243bfdD";
        // const contractAddress = "0x027E6C639eCC0dDB9487cc5Db53905FcEe177cC4";

        const dataHash = `${aadhar}${pan}`; // Simple concatenation for the hash
        // Create the transaction object with legacy gas pricing
        const tx = {
          from: account,
          to: contractAddress,
          gas: 200000,           // Estimate the required gas limit
          gasPrice: gasPrice,    // Legacy gas pricing, non-EIP-1559
          data: contractInstance.methods.newCustomer(name, dataHash, bankAddress).encodeABI(), // Encoded method call
        };
  
        // Send the transaction
        await web3.eth.sendTransaction(tx);
        alert("Customer registered successfully!");
    } catch (error) {
      alert("Registration failed: " + error.message);
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="customer-registration">
      <h2 className="header">Customer Registration</h2>
      <input
        className="input-field"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="input-field"
        placeholder="Aadhar Number"
        value={aadhar}
        onChange={(e) => setAadhar(e.target.value)}
      />
      <input
        className="input-field"
        placeholder="PAN Number"
        value={pan}
        onChange={(e) => setPan(e.target.value)}
      />
      <input
        className="input-field"
        placeholder="Bank (Organisation) Address"
        value={bankAddress}
        onChange={(e) => setBankAddress(e.target.value)}
      />
      <button className="register-button" onClick={registerCustomer}>Register</button>
    </div>
  );
}
