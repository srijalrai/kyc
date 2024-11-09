import React, { useState } from 'react';
import '../styles/CustomerRegistration.css';
import '../styles/Common.css';

export default function CustomerRegistration({ contract, account }) {
  const [name, setName] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [pan, setPan] = useState('');
  const [bankAddress, setBankAddress] = useState('');

  const registerCustomer = async () => {
    try {
      const dataHash = `${aadhar}${pan}`; // Simple concatenation for the hash
      await contract.methods.newCustomer(name, dataHash, bankAddress).send({ from: account });
      alert("Customer registered successfully!");
    } catch (error) {
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
