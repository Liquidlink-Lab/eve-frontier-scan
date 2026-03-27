import { normalizeSuiAddress } from "./address";
import type { WalletAccessContext, WalletSource } from "./types";

interface SearchParamReader {
  get(name: string): string | null;
}

export function buildDashboardNetworkNodesHref(
  characterId: string,
  access: WalletAccessContext,
) {
  return buildDashboardCharacterHref(characterId, "network-nodes", access);
}

export function buildDashboardNetworkNodeDetailHref(
  characterId: string,
  nodeId: string,
  access: WalletAccessContext,
) {
  return buildDashboardCharacterHref(
    characterId,
    `network-nodes/${nodeId}`,
    access,
  );
}

export function buildDashboardAssembliesHref(
  characterId: string,
  access: WalletAccessContext,
) {
  return buildDashboardCharacterHref(characterId, "assemblies", access);
}

export function buildDashboardAssemblyDetailHref(
  characterId: string,
  assemblyId: string,
  access: WalletAccessContext,
) {
  return buildDashboardCharacterHref(
    characterId,
    `assemblies/${assemblyId}`,
    access,
  );
}

export function buildDashboardShipsHref(
  characterId: string,
  access: WalletAccessContext,
) {
  return buildDashboardCharacterHref(characterId, "ships", access);
}

export function buildDashboardGatesHref(
  characterId: string,
  access: WalletAccessContext,
) {
  return buildDashboardCharacterHref(characterId, "gates", access);
}

function buildDashboardCharacterHref(
  characterId: string,
  pathSuffix: string,
  access: WalletAccessContext,
) {
  const searchParams = new URLSearchParams({
    wallet: access.walletAddress,
    source: access.source,
  });

  return `/dashboard/${characterId}/${pathSuffix}?${searchParams.toString()}`;
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
