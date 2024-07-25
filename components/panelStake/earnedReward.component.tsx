import { useState, useContext, useEffect } from "react";
import { ethers } from "ethers";
import Web3Context from "@/context/Web3Context";
import { configEnv } from "@/configs/env";
type IEarnedRewardComponentProps = { coinAddress: string };
export const EarnedRewardComponent: React.FC<IEarnedRewardComponentProps> = ({
  coinAddress,
}) => {
  const { stakingContract, selectedAccount } = useContext(Web3Context);
  const [rewardVal, setRewardVal] = useState("0");

  useEffect(() => {
    const fetchStakeRewardInfo = async () => {
      try {
        //fetching earned amount of a user
        const rewardValueWei = await stakingContract.earned(
          coinAddress,
          selectedAccount
        );
        const rewardValueEth = ethers
          .formatUnits(rewardValueWei, 18)
          .toString();
        const roundedReward = parseFloat(rewardValueEth).toFixed(2);
        setRewardVal(roundedReward);
      } catch (error: any) {
        console.error(error.message);
      }
    };
    const interval = setInterval(() => {
      stakingContract && fetchStakeRewardInfo();
    }, 20000);
    return () => clearInterval(interval);
  }, [stakingContract, selectedAccount]);

  return (
    <div className="earned-reward">
      <p>Earned Reward:</p>
      <span>{rewardVal}</span>
    </div>
  );
};
