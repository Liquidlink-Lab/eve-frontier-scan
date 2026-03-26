"use client";

import { redirect } from "next/navigation";

import { useWalletSession } from "@/features/wallet/useWalletSession";

export default function HomeWalletRedirect() {
  const walletSession = useWalletSession();

  if (walletSession.isConnected && walletSession.walletAddress) {
    redirect("/me");
  }

  return null;
}
