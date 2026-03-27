import { describe, expect, it, vi } from "vitest";

const pkg = "0xworld";

describe("discoverOwnedStructures", () => {
  it("walks wallet profiles through character-owned owner caps into world structures", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-28T00:00:00.000Z"));
    const networkNodeId =
      "0x0000000000000000000000000000000000000000000000000000000000000011";
    const storageUnitId =
      "0x0000000000000000000000000000000000000000000000000000000000000022";
    const foreignGateId =
      "0x0000000000000000000000000000000000000000000000000000000000000033";

    const graphQl = vi.fn(
      async (_query: string, variables: Record<string, unknown>) => {
        if (variables.owner === "0xwallet") {
          expect(variables).toEqual({
            owner: "0xwallet",
          });

          return {
            data: {
              objects: {
                nodes: [
                  {
                    address: "0xcoin-1",
                    asMoveObject: {
                      contents: {
                        type: {
                          repr: "0x2::coin::Coin<0x2::sui::SUI>",
                        },
                        json: {
                          id: "0xcoin-1",
                        },
                      },
                    },
                  },
                  {
                    address: "0xprofile-1",
                    asMoveObject: {
                      contents: {
                        type: {
                          repr: `${pkg}::character::PlayerProfile`,
                        },
                        json: {
                          id: "0xprofile-1",
                          character_id: "0xcharacter-1",
                        },
                      },
                    },
                  },
                ],
              },
            },
          };
        }

        if (variables.owner === "0xcharacter-1") {
          expect(variables).toEqual({
            owner: "0xcharacter-1",
          });

          return {
            data: {
              objects: {
                nodes: [
                  {
                    address: "0xforeign-cap",
                    asMoveObject: {
                      contents: {
                        type: {
                          repr: "0xdeadbeef::access::OwnerCap<0xdeadbeef::gate::Gate>",
                        },
                        json: {
                          id: "0xforeign-cap",
                          authorized_object_id: "0xforeign-gate-1",
                        },
                      },
                    },
                  },
                  {
                    address: "0xcharacter-cap",
                    asMoveObject: {
                      contents: {
                        type: {
                          repr: `${pkg}::access::OwnerCap<${pkg}::character::Character>`,
                        },
                        json: {
                          id: "0xcharacter-cap",
                          authorized_object_id: "0xcharacter-1",
                        },
                      },
                    },
                  },
                  {
                    address: "0xnode-cap",
                    asMoveObject: {
                      contents: {
                        type: {
                          repr: `${pkg}::access::OwnerCap<${pkg}::network_node::NetworkNode>`,
                        },
                        json: {
                          id: "0xnode-cap",
                          authorized_object_id: networkNodeId,
                        },
                      },
                    },
                  },
                  {
                    address: "0xstorage-cap",
                    asMoveObject: {
                      contents: {
                        type: {
                          repr: `${pkg}::access::OwnerCap<${pkg}::storage_unit::StorageUnit>`,
                        },
                        json: {
                          id: "0xstorage-cap",
                          authorized_object_id: storageUnitId,
                        },
                      },
                    },
                  },
                ],
              },
            },
          };
        }

        if (variables.address === "0xcharacter-1") {
          return {
            data: {
              object: {
                address: "0xcharacter-1",
                asMoveObject: {
                  contents: {
                    type: {
                      repr: `${pkg}::character::Character`,
                    },
                    json: {
                      id: "0xcharacter-1",
                      owner_cap_id: "0xcharacter-cap",
                      tribe_id: 3,
                      metadata: {
                        name: "Rhea Ancru",
                      },
                    },
                  },
                },
              },
            },
          };
        }

        if (variables.address === networkNodeId) {
          return {
            data: {
              object: {
                address: networkNodeId,
                asMoveObject: {
                  contents: {
                    type: {
                      repr: `${pkg}::network_node::NetworkNode`,
                    },
                    json: {
                      id: networkNodeId,
                      type_id: "88092",
                      owner_cap_id: "0xnode-cap",
                      metadata: {
                        name: "Node Prime",
                      },
                      status: {
                        status: {
                          "@variant": "ONLINE",
                        },
                      },
                      fuel: {
                        burn_rate_in_ms: "3600000",
                        burn_start_time: "1774656000000",
                        is_burning: true,
                        max_capacity: "100",
                        previous_cycle_elapsed_time: "0",
                        quantity: "2",
                        type_id: "78437",
                        unit_volume: "30",
                      },
                      connected_assembly_ids: [storageUnitId, foreignGateId],
                    },
                  },
                },
              },
            },
          };
        }

        if (variables.address === storageUnitId) {
          return {
            data: {
              object: {
                address: storageUnitId,
                asMoveObject: {
                  contents: {
                    type: {
                      repr: `${pkg}::storage_unit::StorageUnit`,
                    },
                    json: {
                      id: storageUnitId,
                      type_id: "77917",
                      owner_cap_id: "0xstorage-cap",
                      metadata: {
                        name: "Storage Alpha",
                      },
                      status: {
                        status: {
                          "@variant": "ONLINE",
                        },
                      },
                    },
                  },
                },
              },
            },
          };
        }

        if (variables.address === foreignGateId) {
          return {
            data: {
              object: {
                address: foreignGateId,
                asMoveObject: {
                  contents: {
                    type: {
                      repr: `${pkg}::gate::Gate`,
                    },
                    json: {
                      id: foreignGateId,
                      type_id: "84955",
                      owner_cap_id: "0xforeign-gate-cap",
                      metadata: {
                        name: "Transit Authority",
                      },
                      status: {
                        status: {
                          "@variant": "OFFLINE",
                        },
                      },
                    },
                  },
                },
              },
            },
          };
        }

        if (variables.type === `${pkg}::location::LocationRegistry`) {
          return {
            data: {
              objects: {
                nodes: [
                  {
                    address: "0xlocation-registry",
                    asMoveObject: {
                      contents: {
                        json: {
                          id: "0xlocation-registry",
                          locations: {
                            id: "0xlocations-table",
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

        if (variables.tableId === "0xlocations-table") {
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
                  null,
                ],
              },
            },
          };
        }

        throw new Error(`Unexpected GraphQL variables: ${JSON.stringify(variables)}`);
      },
    );

    const modulePath = "./assemblyDiscovery";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      discoverOwnedStructures: undefined,
    }));

    expect(typeof loadedModule.discoverOwnedStructures).toBe("function");

    const result = await loadedModule.discoverOwnedStructures?.({
      walletAddress: "0xwallet",
      packageId: pkg,
      graphQl,
    });

    expect(result).toEqual({
      walletAddress: "0xwallet",
      characters: [
        {
          character: {
            id: "0xcharacter-1",
            name: "Rhea Ancru",
            ownerCapId: "0xcharacter-cap",
            tribeId: 3,
          },
          characterId: "0xcharacter-1",
          playerProfileIds: ["0xprofile-1"],
          ownedStructures: [
            {
              connectedAssemblyIds: [storageUnitId, foreignGateId],
              fuelPercent: 60,
              fuelEtaMs: 9720000,
              fuelQuantity: 2,
              id: networkNodeId,
              location: {
                solarSystemId: 30013131,
                x: "-100",
                y: "25",
                z: "3000",
              },
              typeLabel: "Network Node",
              typeRepr: `${pkg}::network_node::NetworkNode`,
              typeId: 88092,
              name: "Node Prime",
              ownerCapId: "0xnode-cap",
              status: "online",
            },
            {
              connectedAssemblyIds: [],
              fuelPercent: null,
              fuelQuantity: null,
              id: storageUnitId,
              typeLabel: "Storage Unit",
              typeRepr: `${pkg}::storage_unit::StorageUnit`,
              typeId: 77917,
              name: "Storage Alpha",
              ownerCapId: "0xstorage-cap",
              status: "online",
            },
          ],
          relatedStructures: [
            {
              connectedAssemblyIds: [],
              fuelPercent: null,
              fuelQuantity: null,
              id: foreignGateId,
              typeLabel: "Gate",
              typeRepr: `${pkg}::gate::Gate`,
              typeId: 84955,
              name: "Transit Authority",
              ownerCapId: "0xforeign-gate-cap",
              status: "offline",
            },
          ],
        },
      ],
    });

    vi.useRealTimers();
  });
});
