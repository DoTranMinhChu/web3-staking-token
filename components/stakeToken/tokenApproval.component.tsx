import { useContext, useRef } from "react";
import { ethers } from "ethers";
import Web3Context from "@/context/Web3Context";
import * as _ from "lodash";
import { BaseButtonComponent } from "../buttons";
import { configEnv } from "@/configs/env";
import { Contract } from "ethers";
import ERC20ABI from "../../ABI/ERC20ABI.json";
export const TokenApprovalComponent = () => {
  const { stakingContract } = useContext(Web3Context);
  const approvedTokenRef = useRef<{ value: string }>({ value: "" });

  const approveToken = async (e: any) => {
    e.preventDefault();
    const amount = approvedTokenRef.current?.value?.trim();
    if (!amount || isNaN(+amount) || +amount <= 0) {
      console.error("Please enter a valid positive number");
      return;
    }
    const amountToSend = ethers.parseUnits(amount, 18).toString();
    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();

      const stakingContractAddress = configEnv.CTKAddress;

      const coinContract = new Contract(
        stakingContractAddress,
        ERC20ABI,
        signer
      );

      const transaction = await coinContract.approve(
        stakingContract.target,
        amountToSend
      );
      const transactionWait = await transaction.wait();
      console.log("transactionWait => ", transactionWait);

      _.set(approvedTokenRef, "current.value", "");
      // const receipt = await transaction.wait();
      // if (receipt.status === 1) {
      //     toast.success("Transaction is successful")
      //     approvedTokenRef.current?.value = "";
      //   } else {
      //       toast.error("Transaction failed. Please try again.")
      //   }
    } catch (error: any) {
      console.error(error.message);
    }
  };
  return (
    <div>
      <form onSubmit={approveToken} className="token-amount-form">
        <label className="token-input-label">Token Approval:</label>
        <input
          type="text"
          ref={approvedTokenRef as any}
          className="max-w-[120px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <BaseButtonComponent
          onClick={approveToken}
          type="submit"
          label="Token Approval"
        />
      </form>
    </div>
  );
};
