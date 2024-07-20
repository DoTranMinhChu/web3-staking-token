import Web3Context from "@/context/Web3Context";
import { useContext } from "react";

export const ConnectedNetworkComponent = () => {
  const { chainId } = useContext(Web3Context);
  if (chainId === null) {
    return <p className="bg-white p-8 rounded-lg text-xs">Not connected</p>;
  } else if (chainId === 11155111) {
    return <p className="bg-white p-8 rounded-lg text-xs">Sepolia</p>;
  } else {
    return (
      <p className="bg-white p-8 rounded-lg text-xs"> Network Not Detected</p>
    );
  }
};
