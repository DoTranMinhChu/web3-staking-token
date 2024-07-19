import { createContext, Dispatch, SetStateAction, useState } from "react";

const StakingContext = createContext<{
  isReload?: boolean;
  setIsReload?: Dispatch<SetStateAction<boolean>>;
}>({});

export const StakingTokenProvider: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ children }) => {
  const [isReload, setIsReload] = useState(false);
  return (
    <StakingContext.Provider value={{ isReload, setIsReload }}>
      {children}
    </StakingContext.Provider>
  );
};
export default StakingContext;
