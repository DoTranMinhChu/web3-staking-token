import { useContext, useRef, useState } from "react";
import { ethers } from "ethers";
import StakingContext from "@/context/StakingTokenContext";
import Web3Context from "@/context/Web3Context";
import _ from "lodash";
import { BaseButtonComponent } from "../buttons";
import { configEnv } from "@/configs/env";

export const StakeAmountComponent = () => {
  const { stakingContract } = useContext(Web3Context);
  const { isReload, setIsReload } = useContext(StakingContext);

  const stakeAmountRef = useRef<{ value: string }>({ value: "" });

  const stakeToken = async (e: any) => {
    e.preventDefault();
    const amount = stakeAmountRef?.current?.value?.trim();
    console.log(amount);
    if (!amount || isNaN(+amount) || +amount <= 0) {
      console.error("Please enter a valid positive number");
    }
    const amountToStake = ethers.parseUnits(amount, 18).toString();
    try {
      console.log("amountToStake => ", amountToStake);
      const transaction = await stakingContract.stake(
        configEnv.CTKAddress,
        amountToStake
      );
      const result = await transaction.wait();
      console.log(result);
      // await toast.promise(transaction.wait(), {
      //   loading: "Transaction is pending...",
      //   success: "Transaction successful 👌",
      //   error: "Transaction failed 🤯",
      // });

      _.set(stakeAmountRef, "current.value", "");
      if (setIsReload) setIsReload(!isReload);
      // if (receipt.status === 1) {
      //     setIsReload(!isReload);
      //     stakeAmountRef.current.value = "";
      //   } else {
      //       toast.error("Transaction failed. Please try again.")
      //   }
    } catch (error: any) {
      console.error(error.message);
    }
  };
  return (
    <form onSubmit={stakeToken} className="flex items-center space-x-3">
      <label>Staked Amount:</label>
      <input
        type="text"
        ref={stakeAmountRef as any}
        className="max-w-[120px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <BaseButtonComponent onClick={stakeToken} type="submit">
        Stake Token
      </BaseButtonComponent>
    </form>
  );
};
