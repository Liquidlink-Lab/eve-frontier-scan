import snapshot from "./solar-systems.snapshot.json";

interface SolarSystemRecord {
  id: number;
  name: string;
  constellationId?: number;
  regionId?: number;
}

const solarSystemEntries = Object.values(snapshot as Record<string, SolarSystemRecord>);
const solarSystemLookup = new Map<number, SolarSystemRecord>(
  solarSystemEntries.map((record) => [record.id, record] as const),
);

export function getSolarSystemById(solarSystemId: number) {
  return solarSystemLookup.get(solarSystemId) ?? null;
}

export function getSolarSystemName(solarSystemId: number) {
  return getSolarSystemById(solarSystemId)?.name ?? null;
}

export function getSolarSystemLookup() {
  return solarSystemLookup;
}
