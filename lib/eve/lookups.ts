import type { LabelLookups, WorldTypeRecord } from "./types";

export const eveLabelLookups: LabelLookups = {
  tribeNames: new Map([
    [1, "Amarr"],
    [2, "Gallente"],
    [3, "Caldari"],
    [4, "Minmatar"],
  ]),
  typeNames: new Map([
    [77917, "Heavy Storage"],
    [88064, "Heavy Refinery"],
    [88092, "Network Node"],
  ]),
};

export function createLabelLookupsWithWorldTypes(
  worldTypes: Map<number, WorldTypeRecord>,
): LabelLookups {
  const typeNames = new Map(eveLabelLookups.typeNames);

  for (const [typeId, worldType] of worldTypes) {
    if (!typeNames.has(typeId)) {
      typeNames.set(typeId, worldType.name);
    }
  }

  return {
    tribeNames: eveLabelLookups.tribeNames,
    typeNames,
  };
}
