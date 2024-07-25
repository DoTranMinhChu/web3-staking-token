import { BasePropsType } from "@/types/base.type";

export type WhiteListCoinProps = {
  onChangeSelect?: (newSelect: WhiteListCoinType) => void;
} & BasePropsType<HTMLDivElement>;

export type WhiteListCoinType = {
  address: string;
  tokenName: string;
  isActivated: boolean;
};
