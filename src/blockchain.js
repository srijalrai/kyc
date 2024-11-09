import Web3 from 'web3';
import KycContractABI from './kycContractABI.json';

const web3 = new Web3(window.ethereum); // Ensure Metamask is connected
const contractAddress = "0x3ca2560903380f3822aba98FA93F28293F0D6066"; // Replace with your actual deployed contract address
const contract = new web3.eth.Contract(KycContractABI.abi, contractAddress);


export const getContract = () => {
  if (!window.ethereum) throw new Error("No crypto wallet found");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, KycContractABI.abi, signer);
};

export const checkIfCustomerExists = async () => {
  const contract = getContract();
  return await contract.isCus();
};

// Additional contract methods like newCustomer, viewCustomerData, etc.
