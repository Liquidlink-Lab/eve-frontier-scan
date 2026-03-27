import { describe, expect, it } from "vitest";

import { createLabelLookupsWithWorldTypes, eveLabelLookups } from "./lookups";

describe("eve lookups", () => {
  it("extends static type names with world type names without overriding existing labels", () => {
    const lookups = createLabelLookupsWithWorldTypes(
      new Map([
        [84556, { id: 84556, name: "Smart Turret", iconUrl: "https://cdn.example/turret.png" }],
        [88064, { id: 88064, name: "Refinery Override", iconUrl: "https://cdn.example/refinery.png" }],
      ]),
    );

    expect(lookups.tribeNames).toBe(eveLabelLookups.tribeNames);
    expect(lookups.typeNames.get(84556)).toBe("Smart Turret");
    expect(lookups.typeNames.get(88064)).toBe("Heavy Refinery");
    expect(lookups.typeIcons?.get(84556)).toBe("https://cdn.example/turret.png");
    expect(lookups.typeIcons?.get(88064)).toBe("https://cdn.example/refinery.png");
  });
});
