import { describe, expect, it } from "vitest";

describe("world type snapshot helpers", () => {
  it("resolves known type metadata from the local snapshot", async () => {
    const modulePath = "./worldTypes";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      getWorldTypeById: undefined,
      getWorldTypesByIds: undefined,
    }));

    expect(typeof loadedModule.getWorldTypeById).toBe("function");
    expect(typeof loadedModule.getWorldTypesByIds).toBe("function");

    expect(loadedModule.getWorldTypeById?.(72244)).toMatchObject({
      id: 72244,
      name: "Feral Data",
    });
    expect(loadedModule.getWorldTypeById?.(999_999_999)).toBeNull();

    const lookup = loadedModule.getWorldTypesByIds?.([72244, 72960, 999_999_999]);

    expect(lookup?.get(72244)?.name).toBe("Feral Data");
    expect(lookup?.get(72960)?.name).toBe("Hull Repairer");
    expect(lookup?.has(999_999_999)).toBe(false);
  });
});
