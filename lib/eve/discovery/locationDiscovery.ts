import { bcs } from "@mysten/sui/bcs";

import { normalizeSuiAddress } from "../address";
import type { StructureLocation } from "../types";

interface DiscoverRevealedLocationsParams {
  packageId: string;
  graphQl: (query: string, variables: Record<string, unknown>) => Promise<unknown>;
  structureIds: string[];
}

const LOCATION_REGISTRY_TYPE_SUFFIX = "::location::LocationRegistry";

const GET_LOCATION_REGISTRY = `
  query GetLocationRegistry($type: String!) {
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

const GET_REVEALED_LOCATIONS = `
  query GetRevealedLocations($tableId: SuiAddress!, $keys: [DynamicFieldName!]!) {
    address(address: $tableId) {
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

export async function discoverRevealedLocations({
  packageId,
  graphQl,
  structureIds,
}: DiscoverRevealedLocationsParams) {
  if (structureIds.length === 0) {
    return new Map<string, StructureLocation>();
  }

  const tableId = await resolveLocationTableId(graphQl, packageId);

  if (!tableId) {
    return new Map<string, StructureLocation>();
  }

  const normalizedIds = structureIds
    .map((structureId) => normalizeSuiAddress(structureId))
    .filter((structureId): structureId is string => Boolean(structureId));

  if (normalizedIds.length === 0) {
    return new Map<string, StructureLocation>();
  }

  const response = (await graphQl(GET_REVEALED_LOCATIONS, {
    tableId,
    keys: normalizedIds.map((structureId) => ({
      type: "0x2::object::ID",
      bcs: bcs.Address.serialize(structureId).toBase64(),
    })),
  })) as {
    data?: {
      address?: {
        multiGetDynamicFields?: Array<{
          value?: {
            __typename?: string;
            json?: Record<string, unknown>;
          } | null;
        } | null>;
      } | null;
    };
  };

  const fields = response.data?.address?.multiGetDynamicFields ?? [];
  const locations = new Map<string, StructureLocation>();

  normalizedIds.forEach((structureId, index) => {
    const location = parseLocationRecord(fields[index]?.value?.json);

    if (location) {
      locations.set(structureId, location);
    }
  });

  return locations;
}

async function resolveLocationTableId(
  graphQl: DiscoverRevealedLocationsParams["graphQl"],
  packageId: string,
) {
  const response = (await graphQl(GET_LOCATION_REGISTRY, {
    type: `${packageId}${LOCATION_REGISTRY_TYPE_SUFFIX}`,
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

  const registryJson =
    response.data?.objects?.nodes?.[0]?.asMoveObject?.contents?.json ?? null;
  const locations = registryJson?.locations;

  if (!locations || typeof locations !== "object") {
    return null;
  }

  const tableId = (locations as Record<string, unknown>).id;
  return typeof tableId === "string" ? tableId : null;
}

function parseLocationRecord(record: Record<string, unknown> | undefined) {
  if (!record) {
    return null;
  }

  const solarSystemId = parseInteger(record.solarsystem);
  const x = typeof record.x === "string" ? record.x : null;
  const y = typeof record.y === "string" ? record.y : null;
  const z = typeof record.z === "string" ? record.z : null;

  if (solarSystemId === null || x === null || y === null || z === null) {
    return null;
  }

  return {
    solarSystemId,
    x,
    y,
    z,
  } satisfies StructureLocation;
}

function parseInteger(value: unknown) {
  if (typeof value !== "string" && typeof value !== "number") {
    return null;
  }

  const parsedValue = Number.parseInt(String(value), 10);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}
