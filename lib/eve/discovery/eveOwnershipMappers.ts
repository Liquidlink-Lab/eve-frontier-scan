import type {
  AssemblySummary,
  CharacterSummary,
  LabelLookups,
  NetworkNodeSummary,
  WalletAccessContext,
  WalletStructureDiscovery,
} from "../types";

export function mapDiscoveryToCharacterSummaries(
  discovery: WalletStructureDiscovery,
  access: WalletAccessContext,
  lookups: LabelLookups,
): CharacterSummary[] {
  const summaries: CharacterSummary[] = [];

  for (const entry of discovery.characters) {
    const character = entry.character;

    if (!character) {
      continue;
    }

    summaries.push({
        id: character.id,
        name: character.name,
        tribeName: getTribeName(character.tribeId, lookups),
        walletAddress: access.walletAddress,
        walletSourceLabel:
          access.source === "eve-vault" ? "Connected EVE Vault" : "SUI address",
        networkNodeCount: entry.ownedStructures.filter((structure) =>
          isNetworkNodeType(structure.typeRepr),
        ).length,
        currentShipName: null,
      });
  }

  return summaries.sort((left, right) => left.name.localeCompare(right.name));
}

export function mapDiscoveryToNetworkNodes(
  discovery: WalletStructureDiscovery,
  characterId: string,
  lookups: LabelLookups,
): NetworkNodeSummary[] {
  const characterDiscovery = findCharacterDiscovery(discovery, characterId);

  if (!characterDiscovery) {
    return [];
  }

  const structuresById = new Map(
    characterDiscovery.ownedStructures.map((structure) => [structure.id, structure] as const),
  );

  return characterDiscovery.ownedStructures
    .filter((structure) => isNetworkNodeType(structure.typeRepr))
    .map((networkNode) => ({
      id: networkNode.id,
      name: networkNode.name,
      systemName: null,
      connectedAssemblyCount: networkNode.connectedAssemblyIds.length,
      status: networkNode.status,
      fuelPercent: networkNode.fuelPercent,
      fuelQuantity: networkNode.fuelQuantity,
      connectedAssemblies: networkNode.connectedAssemblyIds.map((connectedId) =>
        mapConnectedAssembly(structuresById.get(connectedId), connectedId, lookups),
      ),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function mapDiscoveryToAssembliesByType(
  discovery: WalletStructureDiscovery,
  characterId: string,
  lookups: LabelLookups,
) {
  const characterDiscovery = findCharacterDiscovery(discovery, characterId);

  if (!characterDiscovery) {
    return {};
  }

  const groups = new Map<string, AssemblySummary[]>();

  for (const structure of characterDiscovery.ownedStructures) {
    if (isNetworkNodeType(structure.typeRepr)) {
      continue;
    }

    const typeLabel = getStructureLabel(structure.typeId, structure.typeLabel, lookups);
    const existingGroup = groups.get(typeLabel) ?? [];

    existingGroup.push({
      id: structure.id,
      name: structure.name,
      status: structure.status,
      typeId: structure.typeId,
      typeLabel,
      typeRepr: structure.typeRepr,
    });
    groups.set(typeLabel, existingGroup);
  }

  return Object.fromEntries(
    Array.from(groups.entries())
      .sort(([leftLabel], [rightLabel]) => leftLabel.localeCompare(rightLabel))
      .map(([label, entries]) => [
        label,
        entries.sort((left, right) => left.name.localeCompare(right.name)),
      ]),
  );
}

function findCharacterDiscovery(
  discovery: WalletStructureDiscovery,
  characterId: string,
) {
  return discovery.characters.find((entry) => entry.characterId === characterId) ?? null;
}

function mapConnectedAssembly(
  structure:
    | WalletStructureDiscovery["characters"][number]["ownedStructures"][number]
    | undefined,
  connectedId: string,
  lookups: LabelLookups,
) {
  if (!structure) {
    return {
      id: connectedId,
      name: `Assembly ${connectedId}`,
      typeLabel: "Assembly",
      status: "unknown" as const,
    };
  }

  return {
    id: structure.id,
    name: structure.name,
    typeLabel: getStructureLabel(structure.typeId, structure.typeLabel, lookups),
    status: structure.status,
  };
}

function getTribeName(tribeId: number | null, lookups: LabelLookups) {
  if (tribeId === null) {
    return "Unknown Tribe";
  }

  return lookups.tribeNames.get(tribeId) ?? `Tribe ${tribeId}`;
}

function getStructureLabel(
  typeId: number | null,
  fallbackLabel: string,
  lookups: LabelLookups,
) {
  if (typeId === null) {
    return fallbackLabel;
  }

  return lookups.typeNames.get(typeId) ?? fallbackLabel;
}

function isNetworkNodeType(typeRepr: string) {
  return typeRepr.includes("::network_node::NetworkNode");
}
