import snapshot from "./world-types.snapshot.json";
import type { WorldTypeRecord } from "./types";

const worldTypeEntries = Object.values(snapshot as Record<string, WorldTypeRecord>);
const worldTypeLookup = new Map<number, WorldTypeRecord>(
  worldTypeEntries.map((record) => [record.id, record] as const),
);

export function getWorldTypeById(typeId: number) {
  return worldTypeLookup.get(typeId) ?? null;
}

export function getWorldTypesByIds(typeIds: number[]) {
  const lookup = new Map<number, WorldTypeRecord>();

  for (const typeId of new Set(typeIds)) {
    const worldType = getWorldTypeById(typeId);

    if (worldType) {
      lookup.set(typeId, worldType);
    }
  }

  return lookup;
}

export function getWorldTypeLookup() {
  return worldTypeLookup;
}
