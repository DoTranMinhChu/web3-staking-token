import { WalletComponent } from "@/components";
import { BaseButtonComponent } from "@/components/buttons";
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
          <div className="max-w-lg mx-auto my-12 bg-gray-300 p-3 rounded-lg">
            <PanelStakeComponent />
            <div>
              <div className="flex items-center space-x-3">
                <BaseButtonComponent onClick={() => handleButtonClick("stake")}>
                  Stake
                </BaseButtonComponent>
                <BaseButtonComponent
                  onClick={() => handleButtonClick("withdraw")}
                >
                  Withdraw
                </BaseButtonComponent>
              </div>

              <div className="m-2 p-2 bg bg-gray-400 rounded-md flex-col space-y-4">
                {displaySection === "stake" && (
                  <>
                    <TokenApprovalComponent />
                    <StakeAmountComponent />
                  </>
                )}
                {displaySection === "withdraw" && (
                  <>
                    <WithdrawStakeAmountComponent />
                  </>
                )}
              </div>
            </div>
          </div>
        </StakingTokenProvider>
      </WalletComponent>
    </div>
  );
}
