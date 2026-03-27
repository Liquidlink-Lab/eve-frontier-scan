import { describe, expect, it, vi } from "vitest";

describe("storageInventoryActivityDiscovery", () => {
  it("scans recent inventory events for the requested storage unit and resolves item labels", async () => {
    const rpc = vi
      .fn()
      .mockResolvedValueOnce({
        result: {
          data: [
            {
              id: {
                txDigest: "tx-minted-1",
                eventSeq: "0",
              },
              parsedJson: {
                assembly_id: "0xstorage-1",
                character_id: "0xpilot-1",
                character_key: {
                  item_id: "2112000137",
                  tenant: "utopia",
                },
                item_id: "1000000015000",
                quantity: "3",
                type_id: "89089",
              },
              timestampMs: "1710000004000",
            },
          ],
          hasNextPage: false,
          nextCursor: null,
        },
      })
      .mockResolvedValueOnce({
        result: {
          data: [
            {
              id: {
                txDigest: "tx-burned-1",
                eventSeq: "0",
              },
              parsedJson: {
                assembly_id: "0xstorage-1",
                character_id: "0xpilot-1",
                character_key: {
                  item_id: "2112000137",
                  tenant: "utopia",
                },
                item_id: "1000000015001",
                quantity: "1",
                type_id: "78437",
              },
              timestampMs: "1710000001000",
            },
          ],
          hasNextPage: false,
          nextCursor: null,
        },
      })
      .mockResolvedValueOnce({
        result: {
          data: [
            {
              id: {
                txDigest: "tx-deposited-1",
                eventSeq: "0",
              },
              parsedJson: {
                assembly_id: "0xstorage-1",
                character_id: "0xpilot-2",
                character_key: {
                  item_id: "2112000200",
                  tenant: "utopia",
                },
                item_id: "1000000015002",
                quantity: "12",
                type_id: "89089",
              },
              timestampMs: "1710000003000",
            },
            {
              id: {
                txDigest: "tx-deposited-ignored",
                eventSeq: "1",
              },
              parsedJson: {
                assembly_id: "0xother-storage",
                character_id: "0xpilot-9",
                item_id: "1000000015999",
                quantity: "99",
                type_id: "99999",
              },
              timestampMs: "1710000003500",
            },
          ],
          hasNextPage: false,
          nextCursor: null,
        },
      })
      .mockResolvedValueOnce({
        result: {
          data: [
            {
              id: {
                txDigest: "tx-withdrawn-1",
                eventSeq: "0",
              },
              parsedJson: {
                assembly_id: "0xstorage-1",
                character_id: "0xpilot-2",
                character_key: {
                  item_id: "2112000200",
                  tenant: "utopia",
                },
                item_id: "1000000015003",
                quantity: "4",
                type_id: "82134",
              },
              timestampMs: "1710000002000",
            },
          ],
          hasNextPage: false,
          nextCursor: null,
        },
      })
      .mockResolvedValueOnce({
        result: {
          data: [
            {
              id: {
                txDigest: "tx-destroyed-1",
                eventSeq: "0",
              },
              parsedJson: {
                assembly_id: "0xstorage-1",
                item_id: "1000000015004",
                quantity: "8",
                type_id: "99999",
              },
              timestampMs: "1710000000500",
            },
          ],
          hasNextPage: false,
          nextCursor: null,
        },
      });

    const modulePath = "./storageInventoryActivityDiscovery";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      discoverStorageInventoryActivity: undefined,
    }));

    expect(typeof loadedModule.discoverStorageInventoryActivity).toBe("function");

    const result = await loadedModule.discoverStorageInventoryActivity?.({
      storageUnitId: "0xstorage-1",
      packageId: "0xpkg",
      rpc,
      pageSize: 5,
      maxPages: 1,
      worldTypes: new Map([
        [
          89089,
          {
            id: 89089,
            name: "Building Foam",
            iconUrl: "https://cdn.example/items/89089.png",
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

    expect(rpc).toHaveBeenNthCalledWith(1, "suix_queryEvents", [
      {
        MoveEventType: "0xpkg::inventory::ItemMintedEvent",
      },
      null,
      5,
      true,
    ]);
    expect(rpc).toHaveBeenNthCalledWith(2, "suix_queryEvents", [
      {
        MoveEventType: "0xpkg::inventory::ItemBurnedEvent",
      },
      null,
      5,
      true,
    ]);
    expect(rpc).toHaveBeenNthCalledWith(3, "suix_queryEvents", [
      {
        MoveEventType: "0xpkg::inventory::ItemDepositedEvent",
      },
      null,
      5,
      true,
    ]);
    expect(rpc).toHaveBeenNthCalledWith(4, "suix_queryEvents", [
      {
        MoveEventType: "0xpkg::inventory::ItemWithdrawnEvent",
      },
      null,
      5,
      true,
    ]);
    expect(rpc).toHaveBeenNthCalledWith(5, "suix_queryEvents", [
      {
        MoveEventType: "0xpkg::inventory::ItemDestroyedEvent",
      },
      null,
      5,
      true,
    ]);
    expect(result).toEqual([
      {
        txDigest: "tx-minted-1",
        timestampMs: 1710000004000,
        action: "minted",
        itemId: 1000000015000,
        itemName: "Building Foam",
        iconUrl: "https://cdn.example/items/89089.png",
        quantity: 3,
        typeId: 89089,
        characterId: "0xpilot-1",
        characterItemId: 2112000137,
      },
      {
        txDigest: "tx-deposited-1",
        timestampMs: 1710000003000,
        action: "deposited",
        itemId: 1000000015002,
        itemName: "Building Foam",
        iconUrl: "https://cdn.example/items/89089.png",
        quantity: 12,
        typeId: 89089,
        characterId: "0xpilot-2",
        characterItemId: 2112000200,
      },
      {
        txDigest: "tx-withdrawn-1",
        timestampMs: 1710000002000,
        action: "withdrawn",
        itemId: 1000000015003,
        itemName: "Antimatter Charge",
        iconUrl: "https://cdn.example/items/82134.png",
        quantity: 4,
        typeId: 82134,
        characterId: "0xpilot-2",
        characterItemId: 2112000200,
      },
      {
        txDigest: "tx-burned-1",
        timestampMs: 1710000001000,
        action: "burned",
        itemId: 1000000015001,
        itemName: "EU-90 Fuel",
        iconUrl: "https://cdn.example/items/78437.png",
        quantity: 1,
        typeId: 78437,
        characterId: "0xpilot-1",
        characterItemId: 2112000137,
      },
      {
        txDigest: "tx-destroyed-1",
        timestampMs: 1710000000500,
        action: "destroyed",
        itemId: 1000000015004,
        itemName: "Unknown item (type_id: 99999)",
        iconUrl: null,
        quantity: 8,
        typeId: 99999,
        characterId: null,
        characterItemId: null,
      },
    ]);
  });

  it("returns an empty list when there are no recent inventory events for the storage unit", async () => {
    const rpc = vi.fn().mockResolvedValue({
      result: {
        data: [],
        hasNextPage: false,
        nextCursor: null,
      },
    });

    const modulePath = "./storageInventoryActivityDiscovery";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      discoverStorageInventoryActivity: undefined,
    }));

    expect(typeof loadedModule.discoverStorageInventoryActivity).toBe("function");

    const result = await loadedModule.discoverStorageInventoryActivity?.({
      storageUnitId: "0xstorage-1",
      packageId: "0xpkg",
      rpc,
      pageSize: 10,
      maxPages: 1,
      worldTypes: new Map(),
    });

    expect(result).toEqual([]);
  });
});
