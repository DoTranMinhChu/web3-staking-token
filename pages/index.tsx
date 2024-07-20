import { WalletComponent } from "@/components";
import { HomeNavigationComponent } from "@/components/navigation/home/homeNavigation.component";
import { PanelStakeComponent } from "@/components/panelStake";
import { StakeAmountComponent } from "@/components/stakeToken/stakeAmount.component";
import { TokenApprovalComponent } from "@/components/stakeToken/tokenApproval.component";
import { WithdrawStakeAmountComponent } from "@/components/withdraw";
import { StakingTokenProvider } from "@/context/StakingTokenContext";
import { SetStateAction, useState } from "react";

export default function Home() {
  const [displaySection, setDisplaySection] = useState<string>("stake");

  const handleButtonClick = (section: SetStateAction<string>) => {
    setDisplaySection(section);
  };
  return (
    <div className="main-section">
      <WalletComponent>
        <HomeNavigationComponent />
        <StakingTokenProvider>
          <PanelStakeComponent />
          <div className="main-content">
            <div className="button-section">
              <button
                onClick={() => handleButtonClick("stake")}
                className={displaySection === "stake" ? "" : "active"}
              >
                Stake
              </button>
              <button
                onClick={() => handleButtonClick("withdraw")}
                className={displaySection === "withdraw" ? "" : "active"}
              >
                Withdraw
              </button>
            </div>
            {displaySection === "stake" && (
              <div className="stake-wrapper">
                <TokenApprovalComponent />
                <StakeAmountComponent />
              </div>
            )}
            {displaySection === "withdraw" && (
              <div className="stake-wrapper">
                <WithdrawStakeAmountComponent />
              </div>
            )}
          </div>
        </StakingTokenProvider>
      </WalletComponent>
    </div>
  );
}
