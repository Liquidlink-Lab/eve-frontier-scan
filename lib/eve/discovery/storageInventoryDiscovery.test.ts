import { bcs } from "@mysten/sui/bcs";
import { describe, expect, it, vi } from "vitest";

const storageUnit = {
  id: "0x01edf2e6a8f556e5b44d771a2855a56be017d032b56efd58dfbe3e6f20cbd427",
  ownerCapId: "0xf50f233cc07940bfd478e5289fbcb7edf77c616af88913784492218444252b33",
  typeRepr: "0xpkg::storage_unit::StorageUnit",
};
const openStorageKey =
  "0x429a463a61323293ff82df6e8346cd3ec4f63bbd724d8bae8ecc89cf76269989";

describe("discoverStorageInventories", () => {
  it("reads owner, open, and player-owned inventories for a storage unit", async () => {
    const playerInventoryKey =
      "0x6be4f1af1ff5d9fefe404f43a6b6a7f9c9fd6cb421605f6f2adf17947d13c724";
    const graphQl = vi
      .fn()
      .mockImplementationOnce(async (_query: string, variables: Record<string, unknown>) => {
        expect(variables).toEqual({
          address: storageUnit.id,
        });

        return {
          data: {
            object: {
              asMoveObject: {
                contents: {
                  json: {
                    inventory_keys: [
                      storageUnit.ownerCapId,
                      openStorageKey,
                      playerInventoryKey,
                    ],
                  },
                },
              },
            },
          },
        };
      })
      .mockImplementationOnce(async (_query: string, variables: Record<string, unknown>) => {
        expect(variables).toEqual({
          address: storageUnit.id,
          keys: [
            {
              type: "0x2::object::ID",
              bcs: bcs.Address.serialize(storageUnit.ownerCapId).toBase64(),
            },
            {
              type: "0x2::object::ID",
              bcs: bcs.Address.serialize(openStorageKey).toBase64(),
            },
            {
              type: "0x2::object::ID",
              bcs: bcs.Address.serialize(playerInventoryKey).toBase64(),
            },
          ],
        });

        return {
          data: {
            address: {
              multiGetDynamicFields: [
                {
                  value: {
                    __typename: "MoveValue",
                    json: {
                      max_capacity: "20000000",
                      used_capacity: "195",
                      items: {
                        contents: [
                          {
                            key: "82134",
                            value: {
                              tenant: "utopia",
                              type_id: "82134",
                              item_id: "1000000019584",
                              volume: "65",
                              quantity: 3,
                            },
                          },
                        ],
                      },
                    },
                  },
                },
                {
                  value: {
                    __typename: "MoveValue",
                    json: {
                      max_capacity: "20000000",
                      used_capacity: "5200",
                      items: {
                        contents: [
                          {
                            key: "78437",
                            value: {
                              tenant: "utopia",
                              type_id: "78437",
                              item_id: "1000000078437",
                              volume: "28",
                              quantity: "12",
                            },
                          },
                        ],
                      },
                    },
                  },
                },
                {
                  value: {
                    __typename: "MoveValue",
                    json: {
                      max_capacity: "20000000",
                      used_capacity: "780",
                      items: {
                        contents: [
                          {
                            key: "89089",
                            value: {
                              tenant: "utopia",
                              type_id: "89089",
                              item_id: "1000000089089",
                              volume: "390",
                              quantity: "2",
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
        };
      });

    const modulePath = "./storageInventoryDiscovery";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      discoverStorageInventories: undefined,
    }));

    expect(typeof loadedModule.discoverStorageInventories).toBe("function");

    const inventories = await loadedModule.discoverStorageInventories?.({
      assembly: storageUnit,
      graphQl,
      worldTypes: new Map([
        [
          82134,
          {
            id: 82134,
            name: "Antimatter Charge",
            iconUrl: "https://cdn.example/items/82134.png",
          },
        ],
        [
          78437,
          {
            id: 78437,
            name: "EU-90 Fuel",
            iconUrl: "https://cdn.example/items/78437.png",
          },
        ],
      ]),
    });

    expect(inventories).toEqual({
      ownerInventory: {
        maxCapacity: 20_000_000,
        usedCapacity: 195,
        items: [
          {
            itemId: 1_000_000_019_584,
            itemName: "Antimatter Charge",
            iconUrl: "https://cdn.example/items/82134.png",
            quantity: 3,
            typeId: 82_134,
            volume: 65,
          },
        ],
      },
      openStorageInventory: {
        maxCapacity: 20_000_000,
        usedCapacity: 5_200,
        items: [
          {
            itemId: 1_000_000_078_437,
            itemName: "EU-90 Fuel",
            iconUrl: "https://cdn.example/items/78437.png",
            quantity: 12,
            typeId: 78_437,
            volume: 28,
          },
        ],
      },
      playerOwnedInventories: [
        {
          ownerCapId: playerInventoryKey,
          inventory: {
            maxCapacity: 20_000_000,
            usedCapacity: 780,
            items: [
              {
                itemId: 1_000_000_089_089,
                itemName: "Unknown item (type_id: 89089)",
                iconUrl: null,
                quantity: 2,
                typeId: 89_089,
                volume: 390,
              },
            ],
          },
        },
      ],
    });
  });
});

describe("discoverStorageInventory", () => {
  it("reads the owner inventory dynamic field and resolves item names", async () => {
    const graphQl = vi.fn(async (_query: string, variables: Record<string, unknown>) => {
      expect(variables).toEqual({
        address: storageUnit.id,
        keys: [
          {
            type: "0x2::object::ID",
            bcs: bcs.Address.serialize(storageUnit.ownerCapId).toBase64(),
          },
        ],
      });

      return {
        data: {
          address: {
            multiGetDynamicFields: [
              {
                value: {
                  __typename: "MoveValue",
                  json: {
                    max_capacity: "20000000",
                    used_capacity: "195",
                    items: {
                      contents: [
                        {
                          key: "82134",
                          value: {
                            tenant: "utopia",
                            type_id: "82134",
                            item_id: "1000000019584",
                            volume: "65",
                            quantity: 3,
                          },
                        },
                        {
                          key: "99999",
                          value: {
                            tenant: "utopia",
                            type_id: "99999",
                            item_id: "1000000099999",
                            volume: "1",
                            quantity: "2",
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      };
    });

    const modulePath = "./storageInventoryDiscovery";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      discoverStorageInventory: undefined,
    }));

    expect(typeof loadedModule.discoverStorageInventory).toBe("function");

    const inventory = await loadedModule.discoverStorageInventory?.({
      assembly: storageUnit,
      graphQl,
      worldTypes: new Map([
        [
          82134,
          {
            id: 82134,
            name: "Antimatter Charge",
            iconUrl: "https://cdn.example/items/82134.png",
          },
        ],
      ]),
    });

    expect(inventory).toEqual({
      maxCapacity: 20_000_000,
      usedCapacity: 195,
      items: [
        {
          itemId: 1_000_000_019_584,
          itemName: "Antimatter Charge",
          iconUrl: "https://cdn.example/items/82134.png",
          quantity: 3,
          typeId: 82_134,
          volume: 65,
        },
        {
          itemId: 1_000_000_099_999,
          itemName: "Unknown item (type_id: 99999)",
          iconUrl: null,
          quantity: 2,
          typeId: 99_999,
          volume: 1,
        },
      ],
    });
  });

  it("returns null for non-storage assemblies", async () => {
    const modulePath = "./storageInventoryDiscovery";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      discoverStorageInventory: undefined,
    }));

    expect(typeof loadedModule.discoverStorageInventory).toBe("function");

    const inventory = await loadedModule.discoverStorageInventory?.({
      assembly: {
        id: "0xassembly-1",
        ownerCapId: "0xowner-1",
        typeRepr: "0xpkg::assembly::Assembly",
      },
      graphQl: vi.fn(),
      worldTypes: new Map(),
    });

    expect(inventory).toBeNull();
  });

  it("returns an empty inventory summary when the owner field is missing", async () => {
    const modulePath = "./storageInventoryDiscovery";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      discoverStorageInventory: undefined,
    }));

    expect(typeof loadedModule.discoverStorageInventory).toBe("function");

    const inventory = await loadedModule.discoverStorageInventory?.({
      assembly: storageUnit,
      graphQl: vi.fn(async () => ({
        data: {
          address: {
            multiGetDynamicFields: [null],
          },
        },
      })),
      worldTypes: new Map(),
    });

    expect(inventory).toEqual({
      maxCapacity: null,
      usedCapacity: null,
      items: [],
    });
  });
});
