"use client";

import { type PropsWithChildren, useEffect, useRef } from "react";
import {
  useCurrentAccount,
  useDAppKit,
  useWallets,
} from "@mysten/dapp-kit-react";

import { formatShortAddress } from "@/lib/eve/address";
import { WalletSessionContext } from "./useWalletSession";

const CONNECTED_STORAGE_KEY = "eve-dapp-connected";
const EVE_VAULT_NAMES = ["EVE Frontier Client Wallet", "Eve Vault"];

let globalAutoConnectAttempted = false;

export default function WalletSessionProvider({ children }: PropsWithChildren) {
  const currentAccount = useCurrentAccount();
  const dAppKit = useDAppKit();
  const wallets = useWallets();
  const hasAttemptedAutoConnect = useRef(false);

  const eveVaultWallet =
    wallets.find((wallet) =>
      EVE_VAULT_NAMES.some((name) =>
        wallet.name.toLowerCase().includes(name.toLowerCase()),
      ),
    ) ?? null;

  const connect = () => {
    const walletToConnect = eveVaultWallet ?? wallets[0];

    if (!walletToConnect) {
      return;
    }

    void dAppKit.connectWallet({ wallet: walletToConnect });

    if (typeof window !== "undefined") {
      window.localStorage.setItem(CONNECTED_STORAGE_KEY, "true");
    }
  };

  const disconnect = () => {
    dAppKit.disconnectWallet();

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CONNECTED_STORAGE_KEY);
    }
  };

  useEffect(() => {
    if (hasAttemptedAutoConnect.current || globalAutoConnectAttempted) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    if (window.localStorage.getItem(CONNECTED_STORAGE_KEY) !== "true") {
      return;
    }

    if (!eveVaultWallet) {
      return;
    }

    hasAttemptedAutoConnect.current = true;
    globalAutoConnectAttempted = true;

    void dAppKit.connectWallet({ wallet: eveVaultWallet });
  }, [dAppKit, eveVaultWallet]);

  return (
    <WalletSessionContext.Provider
      value={{
        connect,
        disconnect,
        hasEveVault: eveVaultWallet !== null,
        isConnected: currentAccount !== null,
        shortAddress: currentAccount ? formatShortAddress(currentAccount.address) : null,
        walletAddress: currentAccount?.address ?? null,
      }}
    >
      {children}
    </WalletSessionContext.Provider>
  );
}
