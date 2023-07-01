import { ethers, BigNumber } from "ethers";
import EnergyTrade from "../artifacts/contracts/EnergyTrade.sol/EnergyTrade.json";

import { RelayProvider } from "@opengsn/provider";

const WHITELIST_PAYMASTER = "0x788A679C5Bc41666783B97d8b007a29885a80ba9";
const ACCEPT_EVERYTHING_PAYMASTER =
  "0x086c11bd5A61ac480b326916656a33c474d1E4d8";
const ENERGY_TRADE_CONTRACT_ADDRESS =
  "0xc3421Ea907682324112C8Eec854E187Cb3d31E3e";

const gsnConfig = {
  paymasterAddress: ACCEPT_EVERYTHING_PAYMASTER,
};

const gsnProvider = RelayProvider.newProvider({
  provider: window.ethereum,
  config: gsnConfig,
});
await gsnProvider.init();

const etherProvider = new ethers.providers.Web3Provider(gsnProvider);
export const GSN_signer = etherProvider.getSigner();

export const GSN_ReadContracts = new ethers.Contract(
  ENERGY_TRADE_CONTRACT_ADDRESS,
  EnergyTrade.abi,
  etherProvider
);

export const GSN_WriteContracts = new ethers.Contract(
  ENERGY_TRADE_CONTRACT_ADDRESS,
  EnergyTrade.abi,
  GSN_signer
);
