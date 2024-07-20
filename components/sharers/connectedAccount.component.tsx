import Web3Context from "@/context/Web3Context";
import { useContext } from "react";

export const ConnectedAccountComponent = () => {
  const { selectedAccount } = useContext(Web3Context);
  return (
    <div>
      <p className="bg-white p-8 rounded-lg text-xs">
        {selectedAccount ? selectedAccount : "Connect Account"}
      </p>
    </div>
  );
};
