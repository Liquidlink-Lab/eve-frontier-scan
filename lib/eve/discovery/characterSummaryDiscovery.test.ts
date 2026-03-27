import { describe, expect, it, vi } from "vitest";

describe("characterSummaryDiscovery", () => {
  it("loads character names and wallet addresses for character ids", async () => {
    const rpc = vi.fn().mockResolvedValue({
      result: [
        {
          data: {
            objectId: "0xpilot-1",
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
        {
          data: {
            objectId: "0xignored",
            type: "0xpkg::storage_unit::StorageUnit",
            content: {
              dataType: "moveObject",
              fields: {},
            },
          },
        },
      ],
    });

    const modulePath = "./characterSummaryDiscovery";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      discoverCharacterSummaries: undefined,
    }));

    expect(typeof loadedModule.discoverCharacterSummaries).toBe("function");

    const result = await loadedModule.discoverCharacterSummaries?.({
      characterIds: ["0xpilot-1", "0xignored"],
      rpc,
    });

    expect(rpc).toHaveBeenCalledWith("sui_multiGetObjects", [
      ["0xpilot-1", "0xignored"],
      {
        showType: true,
        showContent: true,
      },
    ]);
    expect(result).toEqual(
      new Map([
        [
          "0xpilot-1",
          {
            id: "0xpilot-1",
            name: "Hshiki",
            walletAddress: "0xwallet-1",
          },
        ],
      ]),
    );
  });

  it("returns an empty map when there are no character ids to resolve", async () => {
    const rpc = vi.fn();

    const modulePath = "./characterSummaryDiscovery";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      discoverCharacterSummaries: undefined,
    }));

    expect(typeof loadedModule.discoverCharacterSummaries).toBe("function");

    const result = await loadedModule.discoverCharacterSummaries?.({
      characterIds: [],
      rpc,
    });

    expect(result).toEqual(new Map());
    expect(rpc).not.toHaveBeenCalled();
  });
});
