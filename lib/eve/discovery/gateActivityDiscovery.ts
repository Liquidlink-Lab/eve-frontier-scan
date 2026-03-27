import type { GateJumpSummary, GatePermitSummary } from "../types";
import type { SuiJsonRpcClient } from "./suiRpcClient";

interface DiscoverGateActivityParams {
  gateId: string;
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

export async function discoverGateActivity({
  gateId,
  packageId,
  rpc,
  maxPages = 3,
  pageSize = 20,
}: DiscoverGateActivityParams) {
  return {
    recentJumps: await scanGateJumps({
      gateId,
      eventType: `${packageId}::gate::JumpEvent`,
      rpc,
      maxPages,
      pageSize,
    }),
    recentPermits: await scanGatePermits({
      gateId,
      eventType: `${packageId}::gate::JumpPermitIssuedEvent`,
      rpc,
      maxPages,
      pageSize,
    }),
  };
}

async function scanGateJumps({
  gateId,
  eventType,
  rpc,
  maxPages,
  pageSize,
}: {
  gateId: string;
  eventType: string;
  rpc: SuiJsonRpcClient;
  maxPages: number;
  pageSize: number;
}) {
  const jumps: GateJumpSummary[] = [];
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
    const events = page?.data ?? [];

    for (const event of events) {
      const parsedJson = event.parsedJson;

      if (!parsedJson || !isGateEventMatch(parsedJson, gateId)) {
        continue;
      }

      const txDigest = event.id?.txDigest;
      const timestampMs = parseInteger(event.timestampMs);
      const sourceGateId = getStringValue(parsedJson, "source_gate_id");
      const destinationGateId = getStringValue(parsedJson, "destination_gate_id");

      if (!txDigest || timestampMs === null || !sourceGateId || !destinationGateId) {
        continue;
      }

      jumps.push({
        txDigest,
        timestampMs,
        sourceGateId,
        sourceGateItemId: parseTenantItemId(parsedJson.source_gate_key),
        destinationGateId,
        destinationGateItemId: parseTenantItemId(parsedJson.destination_gate_key),
        characterId: getStringValue(parsedJson, "character_id"),
        characterItemId: parseTenantItemId(parsedJson.character_key),
      });
    }

    if (!page?.hasNextPage || !page.nextCursor) {
      break;
    }

    cursor = page.nextCursor;
  }

  return jumps;
}

async function scanGatePermits({
  gateId,
  eventType,
  rpc,
  maxPages,
  pageSize,
}: {
  gateId: string;
  eventType: string;
  rpc: SuiJsonRpcClient;
  maxPages: number;
  pageSize: number;
}) {
  const permits: GatePermitSummary[] = [];
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
    const events = page?.data ?? [];

    for (const event of events) {
      const parsedJson = event.parsedJson;

      if (!parsedJson || !isGateEventMatch(parsedJson, gateId)) {
        continue;
      }

      const txDigest = event.id?.txDigest;
      const timestampMs = parseInteger(event.timestampMs);
      const jumpPermitId = getStringValue(parsedJson, "jump_permit_id");
      const sourceGateId = getStringValue(parsedJson, "source_gate_id");
      const destinationGateId = getStringValue(parsedJson, "destination_gate_id");

      if (
        !txDigest ||
        timestampMs === null ||
        !jumpPermitId ||
        !sourceGateId ||
        !destinationGateId
      ) {
        continue;
      }

      permits.push({
        txDigest,
        jumpPermitId,
        sourceGateId,
        sourceGateItemId: parseTenantItemId(parsedJson.source_gate_key),
        destinationGateId,
        destinationGateItemId: parseTenantItemId(parsedJson.destination_gate_key),
        characterId: getStringValue(parsedJson, "character_id"),
        characterItemId: parseTenantItemId(parsedJson.character_key),
        expiresAtMs: parseInteger(parsedJson.expires_at_timestamp_ms),
        extensionType: parseTypeName(parsedJson.extension_type),
        timestampMs,
      });
    }

    if (!page?.hasNextPage || !page.nextCursor) {
      break;
    }

    cursor = page.nextCursor;
  }

  return permits;
}

function isGateEventMatch(parsedJson: Record<string, unknown>, gateId: string) {
  return (
    getStringValue(parsedJson, "source_gate_id") === gateId ||
    getStringValue(parsedJson, "destination_gate_id") === gateId
  );
}

function parseTenantItemId(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }

  return parseInteger((value as Record<string, unknown>).item_id);
}

function parseTypeName(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const name = (value as Record<string, unknown>).name;
  return typeof name === "string" ? name : null;
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
