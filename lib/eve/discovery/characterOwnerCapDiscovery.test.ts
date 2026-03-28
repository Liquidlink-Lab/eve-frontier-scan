import { describe, expect, it, vi } from "vitest";

describe("characterOwnerCapDiscovery", () => {
  it("resolves character summaries from character owner cap ids", async () => {
    const rpc = vi
      .fn()
      .mockResolvedValueOnce({
        result: [
          {
            data: {
              objectId: "0xowner-cap-1",
              type: "0xpkg::access::OwnerCap<0xpkg::character::Character>",
              content: {
                dataType: "moveObject",
                fields: {
                  authorized_object_id: "0xcharacter-1",
                },
              },
            },
          },
          {
            data: {
              objectId: "0xowner-cap-2",
              type: "0xpkg::access::OwnerCap<0xpkg::gate::Gate>",
              content: {
                dataType: "moveObject",
                fields: {
                  authorized_object_id: "0xgate-1",
                },
              },
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        result: [
          {
            data: {
              objectId: "0xcharacter-1",
              type: "0xpkg::character::Character",
              content: {
                dataType: "moveObject",
                fields: {
                  character_address: "0xwallet-1",
                  metadata: {
                    fields: {
                      name: "Hshiki",
                    },
                  },
                },
              },
            },
          },
        ],
      });

    const modulePath = "./characterOwnerCapDiscovery";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      discoverCharacterSummariesByOwnerCapIds: undefined,
    }));

    expect(typeof loadedModule.discoverCharacterSummariesByOwnerCapIds).toBe("function");

    const result = await loadedModule.discoverCharacterSummariesByOwnerCapIds?.({
      ownerCapIds: ["0xowner-cap-1", "0xowner-cap-2"],
      rpc,
    });

    expect(rpc).toHaveBeenNthCalledWith(1, "sui_multiGetObjects", [
      ["0xowner-cap-1", "0xowner-cap-2"],
      {
        showType: true,
        showContent: true,
      },
    ]);
    expect(rpc).toHaveBeenNthCalledWith(2, "sui_multiGetObjects", [
      ["0xcharacter-1"],
      {
        showType: true,
        showContent: true,
      },
    ]);
    expect(result).toEqual(
      new Map([
        [
          "0xowner-cap-1",
          {
            ownerCapId: "0xowner-cap-1",
            characterId: "0xcharacter-1",
            name: "Hshiki",
            walletAddress: "0xwallet-1",
          },
        ],
      ]),
    );
  });

  it("returns an empty map when there are no owner cap ids to resolve", async () => {
    const rpc = vi.fn();

    const modulePath = "./characterOwnerCapDiscovery";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      discoverCharacterSummariesByOwnerCapIds: undefined,
    }));

    expect(typeof loadedModule.discoverCharacterSummariesByOwnerCapIds).toBe("function");

    const result = await loadedModule.discoverCharacterSummariesByOwnerCapIds?.({
      ownerCapIds: [],
      rpc,
    });

    expect(result).toEqual(new Map());
    expect(rpc).not.toHaveBeenCalled();
  });
});
