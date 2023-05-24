import { ethers, BigNumber } from "ethers";
import EnergyTrade from "../artifacts/contracts/EnergyTrade.sol/EnergyTrade.json";

export const provider = new ethers.providers.Web3Provider(window.ethereum);
export const signer = provider.getSigner();
export const ReadContracts = new ethers.Contract(
  process.env.REACT_APP_CONTRACT_ADDRESS,
  EnergyTrade.abi,
  provider
);

export const WriteContracts = new ethers.Contract(
  process.env.REACT_APP_CONTRACT_ADDRESS,
  EnergyTrade.abi,
  signer
);
