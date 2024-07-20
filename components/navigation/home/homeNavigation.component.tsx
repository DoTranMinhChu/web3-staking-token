import {
  ConnectedAccountComponent,
  ConnectedNetworkComponent,
} from "@/components/sharers";

export const HomeNavigationComponent = () => {
  return (
    <header className="w-full h-20 p-9 flex flex-row-reverse justify-between items-center bg-[var(--bg-color)] border-b border-[0.4px] border-gray-400">
      <div className="text-[10px] flex flex-row-reverse justify-center items-center gap-3">
        {/* <ClaimReward /> */}
      </div>
      <div className="text-[10px] flex flex-row-reverse justify-center items-center gap-3">
        <ConnectedAccountComponent />
        <ConnectedNetworkComponent />
      </div>
    </header>
  );
};
