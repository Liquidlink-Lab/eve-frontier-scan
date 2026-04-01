"use client";

import { redirect } from "next/navigation";

import { useWalletSession } from "@/features/wallet/useWalletSession";
import type { EveWorld } from "@/lib/eve/env";
import { buildMyDashboardHref } from "@/lib/eve/routes";

interface HomeWalletRedirectProps {
  world: EveWorld;
}

export default function HomeWalletRedirect({
  world,
}: HomeWalletRedirectProps) {
  const walletSession = useWalletSession();

  if (walletSession.isConnected && walletSession.walletAddress) {
    redirect(buildMyDashboardHref(world));
  }

  return null;
}
