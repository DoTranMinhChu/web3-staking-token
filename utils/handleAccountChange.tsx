import { ConnectWalletProps } from "@/types";

export const handleAccountChange = async (
  setState: React.Dispatch<React.SetStateAction<ConnectWalletProps>>
) => {
  try {
    const accounts = await window.ethereum?.request({
      method: "eth_requestAccounts",
    });
    const selectedAccount = accounts ? accounts[0] : undefined;

    if (selectedAccount) {
      setState((prevState) => ({ ...prevState, selectedAccount }));
    } else {
      throw new Error("No accounts found");
    }
  } catch (error) {
    console.error("Error fetching accounts", error);
  }
};
