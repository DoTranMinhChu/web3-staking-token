import { ethers, Contract } from "ethers";

import StakingCoinABI from "../ABI/StakingCoinABI.json";
import { config } from "process";
import { configEnv } from "@/configs/env";

export const connectWallet = async () => {
  try {
    if (window.ethereum === null) {
      throw new Error("Metamsk is not installed");
    }
    const accounts = await window.ethereum?.request({
      method: "eth_requestAccounts",
    });

    let chainIdHex = await window.ethereum?.request({
      method: "eth_chainId",
    });
    const chainId = parseInt(chainIdHex, 16);

    let selectedAccount = accounts[0];
    if (!selectedAccount) {
      throw new Error("No ethereum accounts available");
    }

    const provider = new ethers.BrowserProvider(window.ethereum!);
    const signer = await provider.getSigner();

    const stakingContractAddress = configEnv.smartContractAddress;

    const stakingContract = new Contract(
      stakingContractAddress,
      StakingCoinABI,
      signer
    );

    return {
      provider,
      selectedAccount,
      stakingContract,
      chainId,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
