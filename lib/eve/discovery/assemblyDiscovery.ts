import { formatShortAddress } from "../address";
import { calculateFuelEtaMs, calculateFuelFillPercent } from "../fuel";
import type {
  CharacterStructureDiscovery,
  DiscoveredCharacter,
  DiscoveredStructure,
  NetworkNodeStatus,
  WalletStructureDiscovery,
} from "../types";
import { discoverRevealedLocations } from "./locationDiscovery";

export interface DiscoveryGraphQlObjectNode {
  address?: string;
  asMoveObject?: {
    contents?: {
      type?: {
        repr?: string;
      };
      json?: Record<string, unknown>;
    };
  };
}

export interface DiscoverOwnedStructuresParams {
  walletAddress: string;
  packageId: string;
  graphQl: (
    query: string,
    variables: Record<string, unknown>,
  ) => Promise<unknown>;
}

export const GET_OWNED_PACKAGE_OBJECTS = `
  query GetOwnedObjects($owner: SuiAddress!) {
    objects(
      filter: {
        owner: $owner
      }
    ) {
      nodes {
        address
        asMoveObject {
          contents {
            type {
              repr
            }
            json
          }
        }
      }
    }
  }
`;

export const GET_OBJECT_WITH_JSON = `
  query GetObjectWithJson($address: SuiAddress!) {
    object(address: $address) {
      address
      asMoveObject {
        contents {
          type {
            repr
          }
          json
        }
      }
    }
  }
`;

interface PlayerProfileRecord {
  profileId: string;
  characterId: string;
}

interface OwnerCapRecord {
  id: string;
  authorizedObjectId: string;
}

export async function discoverOwnedStructures({
  walletAddress,
  packageId,
  graphQl,
}: DiscoverOwnedStructuresParams): Promise<WalletStructureDiscovery> {
  const walletOwnedObjects = (await fetchOwnedObjects(graphQl, walletAddress)).filter(
    (node) => isFromPackage(node, packageId),
  );
  const playerProfiles = walletOwnedObjects
    .map((node) => getPlayerProfileRecord(node))
    .filter((profile): profile is PlayerProfileRecord => profile !== null);
  const profilesByCharacter = groupProfilesByCharacter(playerProfiles);
  const characters: CharacterStructureDiscovery[] = [];

  for (const [characterId, profileIds] of profilesByCharacter.entries()) {
    const [characterNode, characterOwnedObjects] = await Promise.all([
      fetchObjectWithJson(graphQl, characterId),
      fetchOwnedObjects(graphQl, characterId),
    ]);
    const ownerCaps = characterOwnedObjects
      .filter((node) => isFromPackage(node, packageId))
      .map((node) => getOwnerCapRecord(node))
      .filter((record): record is OwnerCapRecord => record !== null)
      .filter((record) => record.authorizedObjectId !== characterId);

    const ownedStructures: DiscoveredStructure[] = [];

    for (const ownerCap of ownerCaps) {
      const structureNode = await fetchObjectWithJson(
        graphQl,
        ownerCap.authorizedObjectId,
      );

      if (!structureNode) {
        continue;
      }

      const structure = getStructureRecord(structureNode, ownerCap.id);

      if (structure) {
        ownedStructures.push(structure);
      }
    }
    const relatedStructures = await fetchRelatedStructures(
      graphQl,
      packageId,
      ownedStructures,
    );

    characters.push({
      characterId,
      character: getCharacterRecord(characterNode),
      playerProfileIds: profileIds,
      ownedStructures,
      ...(relatedStructures.length > 0 ? { relatedStructures } : {}),
    });
  }

  const revealedLocations = await discoverRevealedLocations({
    packageId,
    graphQl,
    structureIds: characters.flatMap((character) =>
      getCharacterStructures(character).map((structure) => structure.id),
    ),
  });

  for (const character of characters) {
    character.ownedStructures = character.ownedStructures.map((structure) => {
      const location = revealedLocations.get(structure.id);
      return location ? { ...structure, location } : structure;
    });
    if (character.relatedStructures) {
      character.relatedStructures = character.relatedStructures.map((structure) => {
        const location = revealedLocations.get(structure.id);
        return location ? { ...structure, location } : structure;
      });
    }
  }

  return {
    walletAddress,
    characters,
  };
}

async function fetchOwnedObjects(
  graphQl: DiscoverOwnedStructuresParams["graphQl"],
  owner: string,
) {
  const response = (await graphQl(GET_OWNED_PACKAGE_OBJECTS, {
    owner,
  })) as {
    data?: {
      objects?: {
        nodes?: DiscoveryGraphQlObjectNode[];
      };
    };
  };

  return response.data?.objects?.nodes ?? [];
}

async function fetchObjectWithJson(
  graphQl: DiscoverOwnedStructuresParams["graphQl"],
  address: string,
) {
  const response = (await graphQl(GET_OBJECT_WITH_JSON, {
    address,
  })) as {
    data?: {
      object?: DiscoveryGraphQlObjectNode | null;
    };
  };

  return response.data?.object ?? null;
}

async function fetchRelatedStructures(
  graphQl: DiscoverOwnedStructuresParams["graphQl"],
  packageId: string,
  ownedStructures: DiscoveredStructure[],
) {
  const knownStructureIds = new Set(ownedStructures.map((structure) => structure.id));
  const relatedStructureIds = Array.from(
    new Set(
      ownedStructures.flatMap((structure) =>
        getRelatedStructureIds(structure).filter(
          (relatedId) => !knownStructureIds.has(relatedId),
        ),
      ),
    ),
  );
  const relatedStructures: DiscoveredStructure[] = [];

  for (const structureId of relatedStructureIds) {
    const structureNode = await fetchObjectWithJson(graphQl, structureId);

    if (!structureNode || !isFromPackage(structureNode, packageId)) {
      continue;
    }

    const structure = getStructureRecord(structureNode, null);

    if (!structure || knownStructureIds.has(structure.id)) {
      continue;
    }

    knownStructureIds.add(structure.id);
    relatedStructures.push(structure);
  }

  return relatedStructures;
}

function getRelatedStructureIds(structure: DiscoveredStructure) {
  return [
    ...structure.connectedAssemblyIds,
    ...(structure.energySourceId ? [structure.energySourceId] : []),
  ];
}

function getCharacterStructures(character: CharacterStructureDiscovery) {
  return [
    ...character.ownedStructures,
    ...(character.relatedStructures ?? []),
  ];
}

function groupProfilesByCharacter(playerProfiles: PlayerProfileRecord[]) {
  const profilesByCharacter = new Map<string, string[]>();

  for (const playerProfile of playerProfiles) {
    const existingProfiles = profilesByCharacter.get(playerProfile.characterId) ?? [];
    existingProfiles.push(playerProfile.profileId);
    profilesByCharacter.set(playerProfile.characterId, existingProfiles);
  }

  return profilesByCharacter;
}

function getPlayerProfileRecord(node: DiscoveryGraphQlObjectNode) {
  const typeRepr = getTypeRepr(node);

  if (!typeRepr.includes("::character::PlayerProfile")) {
    return null;
  }

  const json = getJsonContents(node);
  const characterId = getStringValue(json, "character_id");

  if (!characterId) {
    return null;
  }

  return {
    profileId:
      getStringValue(json, "id") ?? node.address ?? formatShortAddress(characterId),
    characterId,
  };
}

function getCharacterRecord(node: DiscoveryGraphQlObjectNode | null): DiscoveredCharacter | null {
  if (!node) {
    return null;
  }

  const typeRepr = getTypeRepr(node);

  if (!typeRepr.includes("::character::Character")) {
    return null;
  }

  const json = getJsonContents(node);
  const id = getStringValue(json, "id") ?? node.address;

  if (!id) {
    return null;
  }

  return {
    id,
    name: getMetadataName(json) ?? `Character ${formatShortAddress(id)}`,
    tribeId: getIntegerValue(json, "tribe_id"),
    ownerCapId: getStringValue(json, "owner_cap_id"),
  };
}

function getOwnerCapRecord(node: DiscoveryGraphQlObjectNode) {
  const typeRepr = getTypeRepr(node);

  if (!typeRepr.includes("::access::OwnerCap<")) {
    return null;
  }

  const json = getJsonContents(node);
  const authorizedObjectId = getStringValue(json, "authorized_object_id");

  if (!authorizedObjectId) {
    return null;
  }

  return {
    id:
      getStringValue(json, "id") ??
      node.address ??
      formatShortAddress(authorizedObjectId),
    authorizedObjectId,
  };
}

function getStructureRecord(
  node: DiscoveryGraphQlObjectNode,
  ownerCapId: string | null,
): DiscoveredStructure | null {
  const json = getJsonContents(node);
  const typeRepr = getTypeRepr(node);
  const id = getStringValue(json, "id") ?? node.address;
  const fuelEtaMs = json ? getFuelEtaMs(json) : null;
  const fuelTypeId = json ? getFuelTypeId(json) : null;

  if (!json || !id) {
    return null;
  }

  return {
    id,
    typeId: getIntegerValue(json, "type_id"),
    typeLabel: getTypeLabel(typeRepr),
    typeRepr,
    name: getMetadataName(json) ?? `${getTypeLabel(typeRepr)} ${formatShortAddress(id)}`,
    description: getMetadataDescription(json),
    url: getMetadataUrl(json),
    itemId: getKeyItemId(json),
    tenant: getKeyTenant(json),
    ownerCapId: getStringValue(json, "owner_cap_id") ?? ownerCapId,
    energySourceId: getStringValue(json, "energy_source_id"),
    linkedGateId: getStringValue(json, "linked_gate_id"),
    extensionType: getExtensionType(json),
    status: getStatus(getStatusVariant(json)),
    fuelPercent: getFuelPercent(json),
    ...(fuelEtaMs === null ? {} : { fuelEtaMs }),
    ...(fuelTypeId === null ? {} : { fuelTypeId }),
    fuelQuantity: getFuelQuantity(json),
    connectedAssemblyIds: getConnectedAssemblyIds(json),
  };
}

function getJsonContents(node: DiscoveryGraphQlObjectNode) {
  const json = node.asMoveObject?.contents?.json;
  return json && typeof json === "object" ? json : null;
}

function getTypeRepr(node: DiscoveryGraphQlObjectNode) {
  return node.asMoveObject?.contents?.type?.repr ?? "";
}

function isFromPackage(node: DiscoveryGraphQlObjectNode, packageId: string) {
  return getTypeRepr(node).startsWith(`${packageId}::`);
}

function getStringValue(record: Record<string, unknown> | null, key: string) {
  const value = record?.[key];
  return typeof value === "string" ? value : null;
}

function getMetadataName(record: Record<string, unknown> | null) {
  return getMetadataTextValue(record, "name");
}

function getMetadataDescription(record: Record<string, unknown> | null) {
  return getMetadataTextValue(record, "description");
}

function getMetadataUrl(record: Record<string, unknown> | null) {
  return getMetadataTextValue(record, "url");
}

function getMetadataTextValue(
  record: Record<string, unknown> | null,
  key: "name" | "description" | "url",
) {
  const metadata = record?.metadata;

  if (!metadata || typeof metadata !== "object") {
    return null;
  }

  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function getKeyItemId(record: Record<string, unknown> | null) {
  const key = record?.key;

  if (!key || typeof key !== "object") {
    return null;
  }

  return parseInteger((key as Record<string, unknown>).item_id);
}

function getKeyTenant(record: Record<string, unknown> | null) {
  const key = record?.key;

  if (!key || typeof key !== "object") {
    return null;
  }

  const tenant = (key as Record<string, unknown>).tenant;
  return typeof tenant === "string" && tenant.length > 0 ? tenant : null;
}

function getExtensionType(record: Record<string, unknown> | null) {
  const extension = record?.extension;

  if (!extension || typeof extension !== "object") {
    return null;
  }

  const name = (extension as Record<string, unknown>).name;
  return typeof name === "string" && name.length > 0 ? name : null;
}

function getTypeLabel(typeRepr: string) {
  if (typeRepr.includes("::network_node::NetworkNode")) {
    return "Network Node";
  }

  if (typeRepr.includes("::storage_unit::StorageUnit")) {
    return "Storage Unit";
  }

  if (typeRepr.includes("::gate::Gate")) {
    return "Gate";
  }

  if (typeRepr.includes("::turret::Turret")) {
    return "Turret";
  }

  if (typeRepr.includes("::manufacturing::Manufacturing")) {
    return "Manufacturing";
  }

  if (typeRepr.includes("::refinery::Refinery")) {
    return "Refinery";
  }

  if (typeRepr.includes("::assembly::Assembly")) {
    return "Assembly";
  }

  return "World Structure";
}

function getIntegerValue(record: Record<string, unknown> | null, key: string) {
  return parseInteger(record?.[key]);
}

function parseInteger(value: unknown) {
  if (typeof value !== "string" && typeof value !== "number") {
    return null;
  }

  const parsedValue = Number.parseInt(String(value), 10);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function getStatusVariant(record: Record<string, unknown>) {
  const status = record.status;

  if (!status || typeof status !== "object") {
    return null;
  }

  const statusObject = (status as Record<string, unknown>).status;

  if (!statusObject || typeof statusObject !== "object") {
    return null;
  }

  const variant = (statusObject as Record<string, unknown>)["@variant"];
  return typeof variant === "string" ? variant : null;
}

function getStatus(statusVariant: string | null): NetworkNodeStatus {
  if (!statusVariant) {
    return "unknown";
  }

  return statusVariant.toUpperCase() === "ONLINE" ? "online" : "offline";
}

function getFuelPercent(record: Record<string, unknown>) {
  const fuel = record.fuel;

  if (!fuel || typeof fuel !== "object") {
    return null;
  }

  const fuelRecord = fuel as Record<string, unknown>;
  return calculateFuelFillPercent({
    maxCapacity: parseInteger(fuelRecord.max_capacity),
    quantity: parseInteger(fuelRecord.quantity),
    unitVolume: parseInteger(fuelRecord.unit_volume),
  });
}

function getFuelQuantity(record: Record<string, unknown>) {
  const fuel = record.fuel;

  if (!fuel || typeof fuel !== "object") {
    return null;
  }

  return parseInteger((fuel as Record<string, unknown>).quantity);
}

function getFuelTypeId(record: Record<string, unknown>) {
  const fuel = record.fuel;

  if (!fuel || typeof fuel !== "object") {
    return null;
  }

  return parseInteger((fuel as Record<string, unknown>).type_id);
}

function getFuelEtaMs(record: Record<string, unknown>) {
  const fuel = record.fuel;

  if (!fuel || typeof fuel !== "object") {
    return null;
  }

  const fuelRecord = fuel as Record<string, unknown>;

  return calculateFuelEtaMs({
    burnRateInMs: parseInteger(fuelRecord.burn_rate_in_ms),
    burnStartTime: parseInteger(fuelRecord.burn_start_time),
    fuelTypeId: parseInteger(fuelRecord.type_id),
    isBurning: Boolean(fuelRecord.is_burning),
    previousCycleElapsedTime: parseInteger(fuelRecord.previous_cycle_elapsed_time),
    quantity: parseInteger(fuelRecord.quantity),
  });
}

function getConnectedAssemblyIds(record: Record<string, unknown>) {
  if (!Array.isArray(record.connected_assembly_ids)) {
    return [];
  }

  return record.connected_assembly_ids.filter(
    (entry): entry is string => typeof entry === "string",
  );
}
