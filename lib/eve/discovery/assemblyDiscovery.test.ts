import { describe, expect, it, vi } from "vitest";

const pkg = "0xworld";

describe("discoverOwnedStructures", () => {
  it("walks wallet profiles through character-owned owner caps into world structures", async () => {
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
                          authorized_object_id: "0xnetwork-node-1",
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
                          authorized_object_id: "0xstorage-unit-1",
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

        if (variables.address === "0xnetwork-node-1") {
          return {
            data: {
              object: {
                address: "0xnetwork-node-1",
                asMoveObject: {
                  contents: {
                    type: {
                      repr: `${pkg}::network_node::NetworkNode`,
                    },
                    json: {
                      id: "0xnetwork-node-1",
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
                        max_capacity: "10",
                        quantity: "6",
                      },
                      connected_assembly_ids: ["0xstorage-unit-1"],
                    },
                  },
                },
              },
            },
          };
        }

        if (variables.address === "0xstorage-unit-1") {
          return {
            data: {
              object: {
                address: "0xstorage-unit-1",
                asMoveObject: {
                  contents: {
                    type: {
                      repr: `${pkg}::storage_unit::StorageUnit`,
                    },
                    json: {
                      id: "0xstorage-unit-1",
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
              connectedAssemblyIds: ["0xstorage-unit-1"],
              fuelPercent: 60,
              fuelQuantity: 6,
              id: "0xnetwork-node-1",
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
              id: "0xstorage-unit-1",
              typeLabel: "Storage Unit",
              typeRepr: `${pkg}::storage_unit::StorageUnit`,
              typeId: 77917,
              name: "Storage Alpha",
              ownerCapId: "0xstorage-cap",
              status: "online",
            },
          ],
        },
      ],
    });
  });
});
