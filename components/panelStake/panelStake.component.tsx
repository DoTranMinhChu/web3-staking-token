import { EarnedRewardComponent } from "./earnedReward.component";
import { RewardRateComponent } from "./rewardRate.component";
import { StakedAmountComponent } from "./stakedAmount.component";

export const PanelStakeComponent = () => {
  return (
    <div className="top-wrapper">
      <StakedAmountComponent />
      <RewardRateComponent />
      <EarnedRewardComponent />
    </div>
  );
};
