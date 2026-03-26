"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useWalletSession } from "@/features/wallet/useWalletSession";

export default function HomeWalletRedirect() {
  const router = useRouter();
  const walletSession = useWalletSession();

  useEffect(() => {
    if (!walletSession.isConnected || !walletSession.walletAddress) {
      return;
    }

    router.replace("/me");
  }, [router, walletSession.isConnected, walletSession.walletAddress]);

  return null;
}
