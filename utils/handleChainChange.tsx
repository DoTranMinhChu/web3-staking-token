import { ConnectWalletProps } from "@/types";

export const handleChainChange = async (
  setState: React.Dispatch<React.SetStateAction<ConnectWalletProps>>
) => {
  try {
    const chainIdHex = await window.ethereum?.request({
      method: "eth_chainId",
    });
    if (chainIdHex) {
      const chainId = parseInt(chainIdHex, 16);
      console.log(chainId);
      setState((prevState) => ({ ...prevState, chainId }));
    } else {
      throw new Error("Failed to get chainId");
    }
  } catch (error) {
    console.error("Error fetching chainId", error);
  }
};
