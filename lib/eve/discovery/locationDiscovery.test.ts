import { bcs } from "@mysten/sui/bcs";
import { describe, expect, it, vi } from "vitest";

describe("discoverRevealedLocations", () => {
  it("resolves a location registry table and batch-loads revealed coordinates by structure id", async () => {
    const networkNodeId = "0x0000000000000000000000000000000000000000000000000000000000000011";
    const assemblyId = "0x0000000000000000000000000000000000000000000000000000000000000022";

    const graphQl = vi.fn(async (_query: string, variables: Record<string, unknown>) => {
      if (variables.type === "0xpkg::location::LocationRegistry") {
        return {
          data: {
            objects: {
              nodes: [
                {
                  address: "0xregistry",
                  asMoveObject: {
                    contents: {
                      json: {
                        id: "0xregistry",
                        locations: {
                          id: "0xtable",
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        };
      }

      if (variables.tableId === "0xtable") {
        expect(variables.keys).toEqual([
          {
            type: "0x2::object::ID",
            bcs: bcs.Address.serialize(networkNodeId).toBase64(),
          },
          {
            type: "0x2::object::ID",
            bcs: bcs.Address.serialize(assemblyId).toBase64(),
          },
        ]);

        return {
          data: {
            address: {
              multiGetDynamicFields: [
                {
                  value: {
                    __typename: "MoveValue",
                    json: {
                      solarsystem: "30013131",
                      x: "-100",
                      y: "25",
                      z: "3000",
                    },
                  },
                },
                null,
              ],
            },
          },
        };
      }

      throw new Error(`Unexpected query variables: ${JSON.stringify(variables)}`);
    });

    const modulePath = "./locationDiscovery";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      discoverRevealedLocations: undefined,
    }));

    expect(typeof loadedModule.discoverRevealedLocations).toBe("function");

    const result = await loadedModule.discoverRevealedLocations?.({
      packageId: "0xpkg",
      graphQl,
      structureIds: [networkNodeId, assemblyId],
    });

    expect(result).toEqual(
      new Map([
        [
          networkNodeId,
          {
            solarSystemId: 30013131,
            x: "-100",
            y: "25",
            z: "3000",
          },
        ],
      ]),
    );
  });
});
