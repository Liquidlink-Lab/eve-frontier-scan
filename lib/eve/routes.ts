import { defaultEveWorld, parseEveWorld, type EveWorld } from "./env";
import { normalizeSuiAddress } from "./address";
import type { DashboardSection, WalletAccessContext, WalletSource } from "./types";

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

export function buildDashboardDefaultHref(
  characterId: string,
  access: WalletAccessContext,
  section: DashboardSection,
) {
  return section === "assemblies"
    ? buildDashboardAssembliesHref(characterId, access)
    : buildDashboardNetworkNodesHref(characterId, access);
}

export function buildLookupHref(address: string, world = defaultEveWorld) {
  return buildHrefWithOptionalWorld(`/lookup/${address}`, world);
}

export function buildLookupCharactersHref(address: string, world = defaultEveWorld) {
  return buildHrefWithOptionalWorld(`/lookup/${address}/characters`, world);
}

export function buildMyDashboardHref(world = defaultEveWorld) {
  return buildHrefWithOptionalWorld("/me", world);
}

export function buildHrefWithWorld(
  pathname: string,
  searchParams: Pick<URLSearchParams, "toString">,
  world: EveWorld,
) {
  const nextSearchParams = new URLSearchParams(searchParams.toString());

  setWorldSearchParam(nextSearchParams, world);

  const nextQuery = nextSearchParams.toString();
  return nextQuery ? `${pathname}?${nextQuery}` : pathname;
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

  setWorldSearchParam(searchParams, access.world);

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
    world: parseEveWorld(searchParams.get("world")),
  };
}

export function getWalletSourceLabel(source: WalletSource) {
  return source === "eve-vault" ? "Connected EVE Vault" : "SUI address";
}

function isWalletSource(value: string | null): value is WalletSource {
  return value === "eve-vault" || value === "sui-address";
}

function buildHrefWithOptionalWorld(pathname: string, world: EveWorld) {
  if (world === defaultEveWorld) {
    return pathname;
  }

  return `${pathname}?${new URLSearchParams({ world }).toString()}`;
}

function setWorldSearchParam(
  searchParams: URLSearchParams,
  world: EveWorld | undefined,
) {
  if (!world || world === defaultEveWorld) {
    searchParams.delete("world");
    return;
  }

  searchParams.set("world", world);
}
