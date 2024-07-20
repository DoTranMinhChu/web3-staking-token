"use client";
import { ConnectWalletProps } from "@/types";
import { createContext } from "react";

const Web3Context = createContext<ConnectWalletProps>({});

export default Web3Context;
