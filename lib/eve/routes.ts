import { normalizeSuiAddress } from "./address";
import type { WalletAccessContext, WalletSource } from "./types";

interface SearchParamReader {
  get(name: string): string | null;
}

export function buildDashboardNetworkNodesHref(
  characterId: string,
  access: WalletAccessContext,
) {
  const searchParams = new URLSearchParams({
    wallet: access.walletAddress,
    source: access.source,
  });

  return `/dashboard/${characterId}/network-nodes?${searchParams.toString()}`;
}

export function parseWalletAccessSearchParams(
  searchParams: SearchParamReader,
): WalletAccessContext | null {
  const walletAddress = normalizeSuiAddress(searchParams.get("wallet") ?? "");
  const source = searchParams.get("source");

  if (!walletAddress || !isWalletSource(source)) {
    return null;
  }

  return {
    walletAddress,
    source,
  };
}

export function getWalletSourceLabel(source: WalletSource) {
  return source === "eve-vault" ? "Connected EVE Vault" : "SUI address";
}

function isWalletSource(value: string | null): value is WalletSource {
  return value === "eve-vault" || value === "sui-address";
}
