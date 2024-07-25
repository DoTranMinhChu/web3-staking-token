import { useContext, useRef } from "react";
import { ethers } from "ethers";
import Web3Context from "../../context/Web3Context";
import StakingContext from "@/context/StakingTokenContext";
import { BaseButtonComponent } from "../buttons";

type IWithdrawStakeAmountProps = { coinAddress: string };
export const WithdrawStakeAmountComponent: React.FC<
  IWithdrawStakeAmountProps
> = ({ coinAddress }) => {
  const { stakingContract } = useContext(Web3Context);
  const { isReload, setIsReload } = useContext(StakingContext);

  const withdrawStakeAmountRef = useRef<{ value: string }>({ value: "" });
  const withdrawStakeToken = async (e: any) => {
    e.preventDefault();
    const amount = withdrawStakeAmountRef.current.value.trim();
    if (!amount || isNaN(+amount) || +amount <= 0) {
      console.error("Please enter a valid positive number");
      return;
    }
    const amountToWithdraw = ethers.parseUnits(amount, 18).toString();
    console.log(amountToWithdraw);
    try {
      const transaction = await stakingContract.withdrawStakedTokens(
        coinAddress,
        amountToWithdraw
      );
      const result = await transaction.wait();
      console.log(result);
      withdrawStakeAmountRef.current.value = "";
      if (setIsReload) setIsReload(!isReload);
      // const receipt = await transaction.wait();
      // if (receipt.status === 1) {
      //     setIsReload(!isReload);
      //     withdrawStakeAmountRef.current.value = "";
      //   } else {
      //       toast.error("Transaction failed. Please try again.")
      //   }
    } catch (error: any) {
      console.error(error?.message);
    }
  };
  return (
    <form className="flex items-center space-x-3" onSubmit={withdrawStakeToken}>
      <label>Withdraw Token:</label>
      <input
        type="text"
        ref={withdrawStakeAmountRef as any}
        className="max-w-[120px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <BaseButtonComponent onClick={withdrawStakeToken} type="submit">
        Withdraw Staked Token
      </BaseButtonComponent>
    </form>
  );
};
