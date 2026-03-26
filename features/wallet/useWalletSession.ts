"use client";

import { createContext, useContext } from "react";

export interface WalletSessionValue {
  connect: () => void;
  disconnect: () => void;
  hasEveVault: boolean;
  isConnected: boolean;
  shortAddress: string | null;
  walletAddress: string | null;
}

export const WalletSessionContext = createContext<WalletSessionValue>({
  connect: () => {},
  disconnect: () => {},
  hasEveVault: false,
  isConnected: false,
  shortAddress: null,
  walletAddress: null,
});

export function useWalletSession() {
  return useContext(WalletSessionContext);
}
