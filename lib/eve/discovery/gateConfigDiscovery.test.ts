import { describe, expect, it, vi } from "vitest";

describe("gateConfigDiscovery", () => {
  it("fetches the max link distance for a gate type and resolves extension freeze state", async () => {
    const graphQl = vi
      .fn()
      .mockResolvedValueOnce({
        data: {
          objects: {
            nodes: [
              {
                asMoveObject: {
                  contents: {
                    json: {
                      max_distance_by_type: {
                        id: "0xtable-1",
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      });
    const rpc = vi
      .fn()
      .mockResolvedValueOnce({
        result: {
          data: {
            content: {
              fields: {
                value: "400000",
              },
            },
          },
        },
      })
      .mockResolvedValueOnce({
        result: {
          data: {
            objectId: "0xfrozen-marker",
          },
        },
      });

    const modulePath = "./gateConfigDiscovery";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      discoverAssemblyExtensionFrozenStatus: undefined,
      discoverGateConfig: undefined,
    }));

    expect(typeof loadedModule.discoverGateConfig).toBe("function");
    expect(typeof loadedModule.discoverAssemblyExtensionFrozenStatus).toBe("function");

    const gateConfig = await loadedModule.discoverGateConfig?.({
      gateTypeId: 84955,
      graphQl,
      packageId: "0xpkg",
      rpc,
    });
    const extensionFrozen = await loadedModule.discoverAssemblyExtensionFrozenStatus?.({
      assemblyId: "0xgate-1",
      packageId: "0xpkg",
      rpc,
    });

    expect(rpc).toHaveBeenNthCalledWith(1, "suix_getDynamicFieldObject", [
      "0xtable-1",
      {
        type: "u64",
        value: "84955",
      },
    ]);
    expect(rpc).toHaveBeenNthCalledWith(2, "suix_getDynamicFieldObject", [
      "0xgate-1",
      {
        type: "0xpkg::extension_freeze::ExtensionFrozenKey",
        value: {
          dummy_field: false,
        },
      },
    ]);
    expect(gateConfig).toEqual({
      maxLinkDistance: 400000,
    });
    expect(extensionFrozen).toBe(true);
  });

  it("returns safe fallbacks when gate config or extension freeze markers are missing", async () => {
    const graphQl = vi.fn().mockResolvedValue({
      data: {
        objects: {
          nodes: [],
        },
      },
    });
    const rpc = vi.fn().mockResolvedValue({
      result: {
        error: {
          code: "dynamicFieldNotFound",
        },
      },
    });

    const modulePath = "./gateConfigDiscovery";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      discoverAssemblyExtensionFrozenStatus: undefined,
      discoverGateConfig: undefined,
    }));

    expect(typeof loadedModule.discoverGateConfig).toBe("function");
    expect(typeof loadedModule.discoverAssemblyExtensionFrozenStatus).toBe("function");

    const gateConfig = await loadedModule.discoverGateConfig?.({
      gateTypeId: 84955,
      graphQl,
      packageId: "0xpkg",
      rpc,
    });
    const extensionFrozen = await loadedModule.discoverAssemblyExtensionFrozenStatus?.({
      assemblyId: "0xgate-1",
      packageId: "0xpkg",
      rpc,
    });

    expect(gateConfig).toEqual({
      maxLinkDistance: null,
    });
    expect(extensionFrozen).toBe(false);
  });
});
