import React from "react";
import { EarnedRewardComponent } from "./earnedReward.component";
import { RewardRateComponent } from "./rewardRate.component";
import { StakedAmountComponent } from "./stakedAmount.component";
import { BasePropsType } from "@/types/base.type";
type PanelStakeProps = {
  coinAddress?: string;
} & BasePropsType<HTMLDivElement>;
export const PanelStakeComponent: React.FC<PanelStakeProps> = ({
  coinAddress,
  ...props
}) => {
  return (
    <div {...props}>
      <StakedAmountComponent coinAddress={coinAddress!} />
      <RewardRateComponent />
      <EarnedRewardComponent coinAddress={coinAddress!} />
    </div>
  );
};
