import type { SuiJsonRpcClient } from "./suiRpcClient";

interface DiscoverCharacterSummariesParams {
  characterIds: string[];
  rpc: SuiJsonRpcClient;
}

interface SuiMultiGetObjectsResponse {
  result?: Array<{
    data?: {
      objectId?: string;
      type?: string;
      content?: {
        dataType?: string;
        fields?: Record<string, unknown>;
      };
    };
  }>;
}

interface ResolvedCharacterSummary {
  id: string;
  name: string;
  walletAddress: string;
}

export async function discoverCharacterSummaries({
  characterIds,
  rpc,
}: DiscoverCharacterSummariesParams) {
  const uniqueCharacterIds = [...new Set(characterIds.filter(Boolean))];

  if (uniqueCharacterIds.length === 0) {
    return new Map<string, ResolvedCharacterSummary>();
  }

  const response = (await rpc("sui_multiGetObjects", [
    uniqueCharacterIds,
    {
      showType: true,
      showContent: true,
    },
  ])) as SuiMultiGetObjectsResponse;

  const summaries = new Map<string, ResolvedCharacterSummary>();

  for (const entry of response.result ?? []) {
    const objectData = entry.data;
    const objectId = objectData?.objectId;
    const objectType = objectData?.type;
    const fields = objectData?.content?.fields;

    if (
      !objectId ||
      !objectType?.includes("::character::Character") ||
      !fields ||
      typeof fields !== "object"
    ) {
      continue;
    }

    const walletAddress = getStringValue(fields, "character_address");
    const name = getNestedStringValue(fields, ["metadata", "fields", "name"]);

    if (!walletAddress || !name) {
      continue;
    }

    summaries.set(objectId, {
      id: objectId,
      name,
      walletAddress,
    });
  }

  return summaries;
}

function getStringValue(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" ? value : null;
}

function getNestedStringValue(
  record: Record<string, unknown>,
  keys: string[],
): string | null {
  let currentValue: unknown = record;

  for (const key of keys) {
    if (!currentValue || typeof currentValue !== "object") {
      return null;
    }

    currentValue = (currentValue as Record<string, unknown>)[key];
  }

  return typeof currentValue === "string" ? currentValue : null;
}
