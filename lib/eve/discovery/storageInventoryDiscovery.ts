import { bcs } from "@mysten/sui/bcs";
import { blake2b } from "@noble/hashes/blake2.js";

import { normalizeSuiAddress } from "../address";
import type {
  StorageInventoriesSummary,
  StorageInventorySummary,
  WorldTypeRecord,
} from "../types";

interface DiscoverStorageInventoryParams {
  assembly: {
    id: string;
    ownerCapId?: string | null;
    typeRepr: string;
  } | null;
  graphQl: (query: string, variables: Record<string, unknown>) => Promise<unknown>;
  worldTypes: Map<number, WorldTypeRecord>;
}

const GET_STORAGE_OWNER_INVENTORY = `
  query GetStorageOwnerInventory($address: SuiAddress!, $keys: [DynamicFieldName!]!) {
    address(address: $address) {
      multiGetDynamicFields(keys: $keys) {
        value {
          __typename
          ... on MoveValue {
            json
          }
        }
      }
    }
  }
`;

export async function discoverStorageInventory({
  assembly,
  graphQl,
  worldTypes,
}: DiscoverStorageInventoryParams): Promise<StorageInventorySummary | null> {
  if (!assembly?.typeRepr.includes("::storage_unit::StorageUnit")) {
    return null;
  }

  const address = normalizeSuiAddress(assembly.id);
  const ownerCapId = normalizeSuiAddress(assembly.ownerCapId ?? "");

  if (!address || !ownerCapId) {
    return createEmptyInventorySummary();
  }

  const response = (await graphQl(GET_STORAGE_OWNER_INVENTORY, {
    address,
    keys: [
      {
        type: "0x2::object::ID",
        bcs: bcs.Address.serialize(ownerCapId).toBase64(),
      },
    ],
  })) as {
    data?: {
      address?: {
        multiGetDynamicFields?: Array<{
          value?: {
            json?: Record<string, unknown>;
          } | null;
        } | null>;
      } | null;
    };
  };

  const inventoryRecord =
    response.data?.address?.multiGetDynamicFields?.[0]?.value?.json;

  return parseInventoryRecord(inventoryRecord, worldTypes);
}

export async function discoverStorageInventories({
  assembly,
  graphQl,
  worldTypes,
}: DiscoverStorageInventoryParams): Promise<StorageInventoriesSummary | null> {
  if (!assembly?.typeRepr.includes("::storage_unit::StorageUnit")) {
    return null;
  }

  const address = normalizeSuiAddress(assembly.id);
  const ownerCapId = normalizeSuiAddress(assembly.ownerCapId ?? "");
  const openStorageKey = address ? deriveOpenStorageKey(address) : null;

  if (!address || !ownerCapId || !openStorageKey) {
    return {
      ownerInventory: createEmptyInventorySummary(),
      openStorageInventory: createEmptyInventorySummary(),
    };
  }

  const response = (await graphQl(GET_STORAGE_OWNER_INVENTORY, {
    address,
    keys: [
      {
        type: "0x2::object::ID",
        bcs: bcs.Address.serialize(ownerCapId).toBase64(),
      },
      {
        type: "0x2::object::ID",
        bcs: bcs.Address.serialize(openStorageKey).toBase64(),
      },
    ],
  })) as {
    data?: {
      address?: {
        multiGetDynamicFields?: Array<{
          value?: {
            json?: Record<string, unknown>;
          } | null;
        } | null>;
      } | null;
    };
  };

  const inventoryRecord =
    response.data?.address?.multiGetDynamicFields?.[0]?.value?.json;
  const openStorageRecord =
    response.data?.address?.multiGetDynamicFields?.[1]?.value?.json;

  return {
    ownerInventory: parseInventoryRecord(inventoryRecord, worldTypes),
    openStorageInventory: parseInventoryRecord(openStorageRecord, worldTypes),
  };
}

function parseInventoryRecord(
  record: Record<string, unknown> | undefined,
  worldTypes: Map<number, WorldTypeRecord>,
): StorageInventorySummary {
  if (!record) {
    return createEmptyInventorySummary();
  }

  const itemsRecord = record.items;
  const contents =
    itemsRecord && typeof itemsRecord === "object"
      ? (itemsRecord as { contents?: unknown[] }).contents
      : undefined;

  return {
    maxCapacity: parseInteger(record.max_capacity),
    usedCapacity: parseInteger(record.used_capacity),
    items: Array.isArray(contents)
      ? contents
          .map((entry) => parseInventoryItem(entry, worldTypes))
          .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
      : [],
  };
}

function parseInventoryItem(
  entry: unknown,
  worldTypes: Map<number, WorldTypeRecord>,
) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const entryRecord = entry as {
    key?: unknown;
    value?: Record<string, unknown>;
  };
  const value = entryRecord.value;

  if (!value || typeof value !== "object") {
    return null;
  }

  const typeId = parseInteger(value.type_id ?? entryRecord.key);
  const itemId = parseInteger(value.item_id);
  const quantity = parseInteger(value.quantity);
  const volume = parseInteger(value.volume);

  if (typeId === null || itemId === null || quantity === null || volume === null) {
    return null;
  }

  return {
    itemId,
    itemName: worldTypes.get(typeId)?.name ?? `Unknown item (type_id: ${typeId})`,
    iconUrl: worldTypes.get(typeId)?.iconUrl ?? null,
    quantity,
    typeId,
    volume,
  };
}

function createEmptyInventorySummary(): StorageInventorySummary {
  return {
    maxCapacity: null,
    usedCapacity: null,
    items: [],
  };
}

function deriveOpenStorageKey(storageUnitId: string) {
  const storageUnitIdBytes = bcs.Address.serialize(storageUnitId).toBytes();
  const openInventoryLabelBytes = new TextEncoder().encode("open_inventory");
  const sourceBytes = new Uint8Array(
    storageUnitIdBytes.length + openInventoryLabelBytes.length,
  );

  sourceBytes.set(storageUnitIdBytes);
  sourceBytes.set(openInventoryLabelBytes, storageUnitIdBytes.length);

  const digest = blake2b(sourceBytes, { dkLen: 32 });
  return normalizeSuiAddress(`0x${bytesToHex(digest)}`);
}

function parseInteger(value: unknown) {
  if (typeof value !== "string" && typeof value !== "number") {
    return null;
  }

  const parsedValue = Number.parseInt(String(value), 10);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
}
