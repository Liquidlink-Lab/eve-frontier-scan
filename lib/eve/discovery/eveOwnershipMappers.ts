import type {
  AssemblySummary,
  CharacterSummary,
  ConnectedAssemblyGroup,
  ConnectedAssemblySummary,
  LabelLookups,
  NetworkNodeDetailSummary,
  NetworkNodeSummary,
  WalletAccessContext,
  WalletStructureDiscovery,
} from "../types";
import { formatShortAddress } from "../address";
import { getWalletSourceLabel } from "../routes";

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
        walletSource: access.source,
        walletSourceLabel: getWalletSourceLabel(access.source),
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

  const structures = getCharacterStructures(characterDiscovery);
  const structuresById = new Map(
    structures.map((structure) => [structure.id, structure] as const),
  );

  return structures
    .filter((structure) => isNetworkNodeType(structure.typeRepr))
    .map((networkNode) => mapNetworkNodeSummary(networkNode, structuresById, lookups))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function mapDiscoveryToNetworkNodeDetail(
  discovery: WalletStructureDiscovery,
  characterId: string,
  nodeId: string,
  lookups: LabelLookups,
): NetworkNodeDetailSummary | null {
  const characterDiscovery = findCharacterDiscovery(discovery, characterId);

  if (!characterDiscovery) {
    return null;
  }

  const structures = getCharacterStructures(characterDiscovery);
  const structuresById = new Map(
    structures.map((structure) => [structure.id, structure] as const),
  );
  const networkNode = structures.find(
    (structure) => structure.id === nodeId && isNetworkNodeType(structure.typeRepr),
  );

  if (!networkNode) {
    return null;
  }

  const summary = mapNetworkNodeSummary(networkNode, structuresById, lookups);

  return {
    ...summary,
    connectedAssemblyGroups: groupConnectedAssemblies(summary.connectedAssemblies),
  };
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

  for (const structure of getCharacterStructures(characterDiscovery)) {
    if (isNetworkNodeType(structure.typeRepr)) {
      continue;
    }

    const typeLabel = getStructureLabel(structure.typeId, structure.typeLabel, lookups);
    const existingGroup = groups.get(typeLabel) ?? [];

    existingGroup.push({
      id: structure.id,
      name: getDisplayName(
        structure.name,
        structure.id,
        structure.typeLabel,
        typeLabel,
      ),
      systemName: getSolarSystemLabel(structure.location),
      ...(structure.location ? { location: structure.location } : {}),
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

function getCharacterStructures(
  characterDiscovery: WalletStructureDiscovery["characters"][number],
) {
  const structuresById = new Map<
    string,
    WalletStructureDiscovery["characters"][number]["ownedStructures"][number]
  >();

  for (const structure of characterDiscovery.ownedStructures) {
    structuresById.set(structure.id, structure);
  }

  for (const structure of characterDiscovery.relatedStructures ?? []) {
    if (!structuresById.has(structure.id)) {
      structuresById.set(structure.id, structure);
    }
  }

  return Array.from(structuresById.values());
}

function mapNetworkNodeSummary(
  networkNode: WalletStructureDiscovery["characters"][number]["ownedStructures"][number],
  structuresById: Map<
    string,
    WalletStructureDiscovery["characters"][number]["ownedStructures"][number]
  >,
  lookups: LabelLookups,
): NetworkNodeSummary {
  return {
    id: networkNode.id,
    name: networkNode.name,
    systemName: getSolarSystemLabel(networkNode.location),
    ...(networkNode.location ? { location: networkNode.location } : {}),
    connectedAssemblyCount: networkNode.connectedAssemblyIds.length,
    status: networkNode.status,
    fuelPercent: networkNode.fuelPercent,
    fuelEtaMs: networkNode.fuelEtaMs,
    fuelQuantity: networkNode.fuelQuantity,
    connectedAssemblies: networkNode.connectedAssemblyIds.map((connectedId) =>
      mapConnectedAssembly(structuresById.get(connectedId), connectedId, lookups),
    ),
  };
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

function groupConnectedAssemblies(
  assemblies: ConnectedAssemblySummary[],
): ConnectedAssemblyGroup[] {
  const orderedLabels = ["Gate", "Storage", "Turret", "Other"] as const;
  const groups = new Map<string, ConnectedAssemblySummary[]>(
    orderedLabels.map((label) => [label, []]),
  );

  for (const assembly of assemblies) {
    groups.get(getConnectedAssemblyGroupLabel(assembly.typeLabel))?.push(assembly);
  }

  return orderedLabels.map((label) => ({
    label,
    assemblies: groups.get(label) ?? [],
  }));
}

function getConnectedAssemblyGroupLabel(typeLabel: string) {
  if (typeLabel.includes("Gate")) {
    return "Gate";
  }

  if (typeLabel.includes("Storage")) {
    return "Storage";
  }

  if (typeLabel.includes("Turret")) {
    return "Turret";
  }

  return "Other";
}

function getDisplayName(
  name: string,
  id: string,
  rawTypeLabel: string,
  resolvedTypeLabel: string,
) {
  const shortId = formatShortAddress(id);
  const rawFallbackName = `${rawTypeLabel} ${shortId}`;
  const resolvedFallbackName = `${resolvedTypeLabel} ${shortId}`;

  if (name === rawFallbackName || name === resolvedFallbackName) {
    return `${resolvedTypeLabel} · ${shortId}`;
  }

  return name;
}

function getSolarSystemLabel(
  location: WalletStructureDiscovery["characters"][number]["ownedStructures"][number]["location"],
) {
  return location ? String(location.solarSystemId) : null;
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
