import type { SuiJsonRpcClient } from "./suiRpcClient";

interface DiscoverGateConfigParams {
  gateTypeId: number | null;
  graphQl: (query: string, variables: Record<string, unknown>) => Promise<unknown>;
  packageId: string;
  rpc: SuiJsonRpcClient;
}

interface DiscoverAssemblyExtensionFrozenStatusParams {
  assemblyId: string;
  packageId: string;
  rpc: SuiJsonRpcClient;
}

const GET_GATE_CONFIG = `
  query GetGateConfig($type: String!) {
    objects(first: 1, filter: { type: $type }) {
      nodes {
        asMoveObject {
          contents {
            json
          }
        }
      }
    }
  }
`;

export async function discoverGateConfig({
  gateTypeId,
  graphQl,
  packageId,
  rpc,
}: DiscoverGateConfigParams) {
  if (gateTypeId === null) {
    return {
      maxLinkDistance: null,
    };
  }

  const response = (await graphQl(GET_GATE_CONFIG, {
    type: `${packageId}::gate::GateConfig`,
  })) as {
    data?: {
      objects?: {
        nodes?: Array<{
          asMoveObject?: {
            contents?: {
              json?: Record<string, unknown>;
            };
          };
        }>;
      };
    };
  };

  const configJson = response.data?.objects?.nodes?.[0]?.asMoveObject?.contents?.json;
  const tableId = getNestedString(configJson, "max_distance_by_type", "id");

  if (!tableId) {
    return {
      maxLinkDistance: null,
    };
  }

  const fieldResponse = ((await rpc("suix_getDynamicFieldObject", [
    tableId,
    {
      type: "u64",
      value: String(gateTypeId),
    },
  ])) as {
    result?: {
      data?: {
        content?: {
          fields?: {
            value?: unknown;
          };
        };
      };
    };
  }) ?? { result: {} };

  return {
    maxLinkDistance: parseInteger(fieldResponse.result?.data?.content?.fields?.value),
  };
}

export async function discoverAssemblyExtensionFrozenStatus({
  assemblyId,
  packageId,
  rpc,
}: DiscoverAssemblyExtensionFrozenStatusParams) {
  const response = (await rpc("suix_getDynamicFieldObject", [
    assemblyId,
    {
      type: `${packageId}::extension_freeze::ExtensionFrozenKey`,
      value: {
        dummy_field: false,
      },
    },
  ])) as {
    result?: {
      data?: unknown;
      error?: {
        code?: unknown;
      };
    };
  };

  if (response.result?.error?.code === "dynamicFieldNotFound") {
    return false;
  }

  if (response.result?.data) {
    return true;
  }

  return null;
}

function getNestedString(
  value: Record<string, unknown> | undefined,
  key: string,
  nestedKey: string,
) {
  const nestedValue = value?.[key];

  if (!nestedValue || typeof nestedValue !== "object") {
    return null;
  }

  const targetValue = (nestedValue as Record<string, unknown>)[nestedKey];
  return typeof targetValue === "string" ? targetValue : null;
}

function parseInteger(value: unknown) {
  if (typeof value !== "string" && typeof value !== "number") {
    return null;
  }

  const parsedValue = Number.parseInt(String(value), 10);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}
