import type {
  StorageInventoryActivityAction,
  StorageInventoryActivitySummary,
  WorldTypeRecord,
} from "../types";
import type { SuiJsonRpcClient } from "./suiRpcClient";

interface DiscoverStorageInventoryActivityParams {
  storageUnitId: string;
  packageId: string;
  rpc: SuiJsonRpcClient;
  worldTypes: Map<number, WorldTypeRecord>;
  maxPages?: number;
  pageSize?: number;
  maxResults?: number;
}

interface SuiEventCursor {
  txDigest: string;
  eventSeq: string;
}

interface SuiEventResponse {
  result?: {
    data?: Array<{
      id?: SuiEventCursor;
      parsedJson?: Record<string, unknown>;
      timestampMs?: string;
    }>;
    hasNextPage?: boolean;
    nextCursor?: SuiEventCursor | null;
  };
}

const STORAGE_EVENT_TYPES: Array<{
  action: StorageInventoryActivityAction;
  eventName:
    | "ItemMintedEvent"
    | "ItemBurnedEvent"
    | "ItemDepositedEvent"
    | "ItemWithdrawnEvent"
    | "ItemDestroyedEvent";
}> = [
  {
    action: "minted",
    eventName: "ItemMintedEvent",
  },
  {
    action: "burned",
    eventName: "ItemBurnedEvent",
  },
  {
    action: "deposited",
    eventName: "ItemDepositedEvent",
  },
  {
    action: "withdrawn",
    eventName: "ItemWithdrawnEvent",
  },
  {
    action: "destroyed",
    eventName: "ItemDestroyedEvent",
  },
];

export async function discoverStorageInventoryActivity({
  storageUnitId,
  packageId,
  rpc,
  worldTypes,
  maxPages = 2,
  pageSize = 20,
  maxResults = 10,
}: DiscoverStorageInventoryActivityParams): Promise<StorageInventoryActivitySummary[]> {
  const entries = await Promise.all(
    STORAGE_EVENT_TYPES.map(({ action, eventName }) =>
      scanStorageInventoryEvents({
        storageUnitId,
        eventType: `${packageId}::inventory::${eventName}`,
        action,
        rpc,
        worldTypes,
        maxPages,
        pageSize,
      }),
    ),
  );

  return entries
    .flat()
    .sort((left, right) => right.timestampMs - left.timestampMs)
    .slice(0, maxResults);
}

async function scanStorageInventoryEvents({
  storageUnitId,
  eventType,
  action,
  rpc,
  worldTypes,
  maxPages,
  pageSize,
}: {
  storageUnitId: string;
  eventType: string;
  action: StorageInventoryActivityAction;
  rpc: SuiJsonRpcClient;
  worldTypes: Map<number, WorldTypeRecord>;
  maxPages: number;
  pageSize: number;
}) {
  const events: StorageInventoryActivitySummary[] = [];
  let cursor: SuiEventCursor | null = null;

  for (let pageIndex = 0; pageIndex < maxPages; pageIndex += 1) {
    const response = (await rpc("suix_queryEvents", [
      {
        MoveEventType: eventType,
      },
      cursor,
      pageSize,
      true,
    ])) as SuiEventResponse;
    const page = response.result;
    const data = page?.data ?? [];

    for (const event of data) {
      const parsedJson = event.parsedJson;

      if (!parsedJson || getStringValue(parsedJson, "assembly_id") !== storageUnitId) {
        continue;
      }

      const txDigest = event.id?.txDigest;
      const timestampMs = parseInteger(event.timestampMs);
      const itemId = parseInteger(parsedJson.item_id);
      const typeId = parseInteger(parsedJson.type_id);
      const quantity = parseInteger(parsedJson.quantity);

      if (
        !txDigest ||
        timestampMs === null ||
        itemId === null ||
        typeId === null ||
        quantity === null
      ) {
        continue;
      }

      events.push({
        txDigest,
        timestampMs,
        action,
        itemId,
        itemName: worldTypes.get(typeId)?.name ?? `Unknown item (type_id: ${typeId})`,
        iconUrl: worldTypes.get(typeId)?.iconUrl ?? null,
        quantity,
        typeId,
        characterId: getStringValue(parsedJson, "character_id"),
        characterItemId: parseTenantItemId(parsedJson.character_key),
      });
    }

    if (!page?.hasNextPage || !page.nextCursor) {
      break;
    }

    cursor = page.nextCursor;
  }

  return events;
}

function parseTenantItemId(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }

  return parseInteger((value as Record<string, unknown>).item_id);
}

function getStringValue(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" ? value : null;
}

function parseInteger(value: unknown) {
  if (typeof value !== "string" && typeof value !== "number") {
    return null;
  }

  const parsedValue = Number.parseInt(String(value), 10);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}
