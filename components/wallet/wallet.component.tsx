import { useState, useEffect } from "react";
import { WalletProps } from "./wallet.type";
import Web3Context from "@/context/Web3Context";
import { connectWallet } from "@/utils/connectWallet";
import { handleAccountChange } from "@/utils/handleAccountChange";
import { handleChainChange } from "@/utils/handleChainChange";
import { ConnectWalletProps } from "@/types";
import { BaseButtonComponent } from "../buttons";

export const WalletComponent: React.FC<WalletProps> = ({ children }) => {
  const [state, setState] = useState<ConnectWalletProps>({
    provider: undefined,
    selectedAccount: undefined,
    stakingContract: undefined,
    chainId: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!window || !window?.ethereum) return;
    window.ethereum?.on("accountsChanged", () => handleAccountChange(setState));
    window.ethereum?.on("chainChanged", () => handleChainChange(setState));

    return () => {
      window.ethereum?.removeListener("accountsChanged", () =>
        handleAccountChange(setState)
      );
      window.ethereum?.removeListener("chainChanged", () =>
        handleChainChange(setState)
      );
    };
  }, []);
  const handleWallet = async () => {
    try {
      setIsLoading(true);
      const { provider, selectedAccount, stakingContract, chainId } =
        await connectWallet();

      setState({
        provider,
        selectedAccount,
        stakingContract,
        chainId,
      });
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="Connect-Wallet">
      <Web3Context.Provider value={state}>{children}</Web3Context.Provider>
      {isLoading && <p>Loading...</p>}
      <BaseButtonComponent
        onClick={handleWallet}
        type="button"
        label="Connect Wallet"
      />
    </div>
  );
};
