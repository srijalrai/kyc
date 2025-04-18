// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Web3 from 'web3';
import CustomerRegistration from './components/customerRegistration';
import OrganisationRegistration from './components/organisationRegistration';
import CustomerDashboard from './components/customerDashboard';
import OrganisationDashboard from './components/organisationDashboard';
import KycContractABI from './kycContractABI.json';

const web3 = new Web3(window.ethereum); // Ensure Metamask is connected // Replace with your actual deployed contract address

const App = () => {
  const [currentView, setCurrentView] = useState("customerRegistration");
  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  console.log(typeof(KycContractABI));


  // for the displaying part

  const [isCustomer, setIsCustomer] = useState(false);
  const [isOrganisation, setIsOrganisation] = useState(false);

  // Function to connect to Metamask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const contractAddress = "0x618309738A063A7396BcABEb5Dc18e0E08191454";
        setContractAddress(contractAddress); // Replace with your deployed contract address
        const contractInstance = new web3Instance.eth.Contract(KycContractABI.abi, contractAddress);
        setContractInstance(contractInstance);


        // Check role

        const selectedAccount = accounts[0];

        const isCus = await contractInstance.methods.isCus().call({ from: selectedAccount });
        const isOrg = await contractInstance.methods.isOrg().call({ from: selectedAccount });
        setIsCustomer(isCus);
        setIsOrganisation(isOrg);


        // Set default view
        if (isOrg) {
          setCurrentView("organisationDashboard");
        } else if (isCus) {
          setCurrentView("customerDashboard");
        } else {
          setCurrentView("customerRegistration");
        }


      } catch (error) {
        console.error("Failed to connect to wallet:", error);
      }
    } else {
      alert("Please install Metamask to use this feature!");
    }
  };

  useEffect(() => {
    if (window.ethereum && account === "") {
      connectWallet();
    }
  }, [account]);


  // useEffect(() => {
  //   if (window.ethereum) {
      
  //   } else {
  //     alert("Please install MetaMask.");
  //   }
  // }, []);

  // Render selected view
  const renderView = () => {
    switch (currentView) {
      case "customerRegistration":
        return <CustomerRegistration account={account} web3={web3} contractInstance={contractInstance} contractAddress={contractAddress}/>;
      case "organisationRegistration":
        return <OrganisationRegistration account={account} web3={web3} contractInstance={contractInstance} contractAddress={contractAddress}/>;
      case "customerDashboard":
        return <CustomerDashboard account={account} contractInstance={contractInstance} />;
      case "organisationDashboard":
        return <OrganisationDashboard account={account} web3={web3} contractInstance={contractInstance} contractAddress={contractAddress}/>;
      default:
        return <CustomerRegistration account={account} contractInstance={contractInstance} contractAddress={contractAddress}/>;
    }
  };

  return (
    <div className="App">
      <h1>KYC Blockchain App</h1>
      
      {/* Display the connected wallet address */}
      <div className="wallet-info">
        {account ? `Connected Account: ${account}` : "Not connected"}
        <button className="connect-button" onClick={connectWallet}>
          {account ? "Connected" : "Connect Wallet"}
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="navbar">
        {!isCustomer && !isOrganisation && (
          <>
            <button onClick={() => setCurrentView("customerRegistration")}>Customer Registration</button>
            <button onClick={() => setCurrentView("organisationRegistration")}>Organisation Registration</button>
          </>
        )}
        {isCustomer && (
          <>
            <button onClick={() => setCurrentView("customerRegistration")}>Customer Registration</button>
            <button onClick={() => setCurrentView("customerDashboard")}>Customer Dashboard</button>
          </>
        )}
        {isOrganisation && (
          <>
            <button onClick={() => setCurrentView("organisationDashboard")}>Organisation Dashboard</button>
          </>
        )}
      </div>

      {/* Render the selected component */}
      <div className="content-section">
        {renderView()}
      </div>
    </div>
  );
};

export default App;
