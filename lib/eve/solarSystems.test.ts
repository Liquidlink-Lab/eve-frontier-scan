import { describe, expect, it } from "vitest";

describe("solar system snapshot helpers", () => {
  it("resolves known solar system names from the local snapshot", async () => {
    const modulePath = "./solarSystems";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      getSolarSystemById: undefined,
      getSolarSystemName: undefined,
    }));

    expect(typeof loadedModule.getSolarSystemById).toBe("function");
    expect(typeof loadedModule.getSolarSystemName).toBe("function");

    expect(loadedModule.getSolarSystemById?.(30013131)).toMatchObject({
      id: 30013131,
      name: "ABJ-G43",
      constellationId: 20000911,
      regionId: 10000119,
    });
    expect(loadedModule.getSolarSystemName?.(30013132)).toBe("UNQ-023");
    expect(loadedModule.getSolarSystemById?.(999_999_999)).toBeNull();
    expect(loadedModule.getSolarSystemName?.(999_999_999)).toBeNull();
  });
});
