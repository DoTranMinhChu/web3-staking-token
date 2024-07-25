import StakingContext from "@/context/StakingTokenContext";
import Web3Context from "@/context/Web3Context";
import { whiteListCoinAddress } from "@/data/whiteListCoin";
import { BasePropsType } from "@/types/base.type";
import { useContext, useEffect, useState } from "react";
import { WhiteListCoinProps, WhiteListCoinType } from "./whiteListCoin.type";

export const WhiteListCoinComponent: React.FC<WhiteListCoinProps> = ({
  onChangeSelect,
  ...props
}) => {
  const { stakingContract } = useContext(Web3Context);
  const [whiteListCoins, setWhiteListCoins] = useState<
    Array<WhiteListCoinType>
  >([]);
  const { isReload } = useContext(StakingContext);
  useEffect(() => {
    const fetchList = async () => {
      if (!stakingContract) return;
      try {
        const promiseWhiteList = whiteListCoinAddress.map((coinAddress) =>
          stakingContract.whiteListTokens(coinAddress)
        );
        const whiteListCoins = await Promise.all(promiseWhiteList);
        setWhiteListCoins(
          whiteListCoins.map((coinInfo: any, index: number) => {
            return {
              address: whiteListCoinAddress[index],
              tokenName: coinInfo[0],
              isActivated: coinInfo[1],
            };
          })
        );
      } catch (error: any) {
        console.error(error.message);
      }
    };
    fetchList();
  }, [stakingContract, isReload]);

  return (
    <div {...props}>
      {whiteListCoins.map((whiteListCoin) => {
        return (
          <button
            onClick={() => {
              if (onChangeSelect) onChangeSelect(whiteListCoin);
            }}
            key={whiteListCoin.address}
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            {whiteListCoin.tokenName}
          </button>
        );
      })}
    </div>
  );
};
