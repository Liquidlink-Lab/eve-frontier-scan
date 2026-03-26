"use client";

import type { PropsWithChildren } from "react";
import { DAppKitProvider } from "@mysten/dapp-kit-react";

import { dAppKit } from "@/lib/eve/wallet/dappKit";
import WalletSessionProvider from "./WalletSessionProvider";

export default function WalletRuntimeProvider({
  children,
}: PropsWithChildren) {
  return (
    <DAppKitProvider dAppKit={dAppKit}>
      <WalletSessionProvider>{children}</WalletSessionProvider>
    </DAppKitProvider>
  );
}
