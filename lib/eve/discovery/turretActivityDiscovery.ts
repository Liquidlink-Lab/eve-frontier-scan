import type { TurretPrioritySnapshotSummary, TurretPriorityTargetSummary } from "../types";
import type { SuiJsonRpcClient } from "./suiRpcClient";

interface DiscoverTurretActivityParams {
  turretId: string;
  packageId: string;
  rpc: SuiJsonRpcClient;
  maxPages?: number;
  pageSize?: number;
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

export async function discoverTurretActivity({
  turretId,
  packageId,
  rpc,
  maxPages = 3,
  pageSize = 20,
}: DiscoverTurretActivityParams): Promise<TurretPrioritySnapshotSummary | null> {
  let cursor: SuiEventCursor | null = null;

  for (let pageIndex = 0; pageIndex < maxPages; pageIndex += 1) {
    const response = (await rpc("suix_queryEvents", [
      {
        MoveEventType: `${packageId}::turret::PriorityListUpdatedEvent`,
      },
      cursor,
      pageSize,
      true,
    ])) as SuiEventResponse;
    const page = response.result;
    const events = page?.data ?? [];

    for (const event of events) {
      const parsedJson = event.parsedJson;

      if (!parsedJson || getStringValue(parsedJson, "turret_id") !== turretId) {
        continue;
      }

      const txDigest = event.id?.txDigest;
      const updatedAtMs = parseInteger(event.timestampMs);
      const targets = parsePriorityList(parsedJson.priority_list);

      if (!txDigest || updatedAtMs === null || targets === null) {
        continue;
      }

      return {
        txDigest,
        updatedAtMs,
        targets,
      };
    }

    if (!page?.hasNextPage || !page.nextCursor) {
      break;
    }

    cursor = page.nextCursor;
  }

  return null;
}

function parsePriorityList(value: unknown) {
  if (!Array.isArray(value)) {
    return null;
  }

  return value
    .map((entry) => parsePriorityTarget(entry))
    .filter((entry): entry is TurretPriorityTargetSummary => entry !== null);
}

function parsePriorityTarget(entry: unknown) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const record = entry as Record<string, unknown>;
  const itemId = parseInteger(record.item_id);
  const typeId = parseInteger(record.type_id);
  const groupId = parseInteger(record.group_id);
  const characterId = parseInteger(record.character_id);
  const characterTribe = parseInteger(record.character_tribe);
  const hpRatio = parseInteger(record.hp_ratio);
  const shieldRatio = parseInteger(record.shield_ratio);
  const armorRatio = parseInteger(record.armor_ratio);
  const priorityWeight = parseInteger(record.priority_weight);
  const behaviourChange = getStringValue(record, "behaviour_change");
  const isAggressor = typeof record.is_aggressor === "boolean" ? record.is_aggressor : null;

  if (
    itemId === null ||
    typeId === null ||
    groupId === null ||
    characterId === null ||
    characterTribe === null ||
    hpRatio === null ||
    shieldRatio === null ||
    armorRatio === null ||
    priorityWeight === null ||
    behaviourChange === null ||
    isAggressor === null
  ) {
    return null;
  }

  return {
    itemId,
    typeId,
    groupId,
    characterId,
    characterTribe,
    hpRatio,
    shieldRatio,
    armorRatio,
    isAggressor,
    priorityWeight,
    behaviourChange,
  } satisfies TurretPriorityTargetSummary;
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
