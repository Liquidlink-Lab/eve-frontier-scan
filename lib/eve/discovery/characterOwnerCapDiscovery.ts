import { discoverCharacterSummaries } from "./characterSummaryDiscovery";
import type { SuiJsonRpcClient } from "./suiRpcClient";

interface DiscoverCharacterSummariesByOwnerCapIdsParams {
  ownerCapIds: string[];
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

interface ResolvedCharacterOwnerCapSummary {
  ownerCapId: string;
  characterId: string;
  name: string;
  walletAddress: string;
}

export async function discoverCharacterSummariesByOwnerCapIds({
  ownerCapIds,
  rpc,
}: DiscoverCharacterSummariesByOwnerCapIdsParams) {
  const uniqueOwnerCapIds = [...new Set(ownerCapIds.filter(Boolean))];

  if (uniqueOwnerCapIds.length === 0) {
    return new Map<string, ResolvedCharacterOwnerCapSummary>();
  }

  const response = (await rpc("sui_multiGetObjects", [
    uniqueOwnerCapIds,
    {
      showType: true,
      showContent: true,
    },
  ])) as SuiMultiGetObjectsResponse;

  const characterIdsByOwnerCapId = new Map<string, string>();

  for (const entry of response.result ?? []) {
    const objectData = entry.data;
    const objectId = objectData?.objectId;
    const objectType = objectData?.type;
    const fields = objectData?.content?.fields;

    if (
      !objectId ||
      !objectType?.includes("::access::OwnerCap<") ||
      !objectType.includes("::character::Character>") ||
      !fields
    ) {
      continue;
    }

    const characterId = getStringValue(fields, "authorized_object_id");

    if (!characterId) {
      continue;
    }

    characterIdsByOwnerCapId.set(objectId, characterId);
  }

  const characterSummaries = await discoverCharacterSummaries({
    characterIds: [...new Set(characterIdsByOwnerCapId.values())],
    rpc,
  });

  const result = new Map<string, ResolvedCharacterOwnerCapSummary>();

  for (const [ownerCapId, characterId] of characterIdsByOwnerCapId.entries()) {
    const summary = characterSummaries.get(characterId);

    if (!summary) {
      continue;
    }

    result.set(ownerCapId, {
      ownerCapId,
      characterId,
      name: summary.name,
      walletAddress: summary.walletAddress,
    });
  }

  return result;
}

function getStringValue(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" ? value : null;
}
