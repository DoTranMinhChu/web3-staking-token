import React from "react";
import { EarnedRewardComponent } from "./earnedReward.component";
import { RewardRateComponent } from "./rewardRate.component";
import { StakedAmountComponent } from "./stakedAmount.component";
import { BasePropsType } from "@/types/base.type";

export const PanelStakeComponent: React.FC<BasePropsType<HTMLDivElement>> = ({
  ...props
}) => {
  return (
    <div {...props}>
      <StakedAmountComponent />
      <RewardRateComponent />
      <EarnedRewardComponent />
    </div>
  );
};
