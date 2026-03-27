import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { eveEnv } from "../lib/eve/env";

interface SolarSystemApiRecord {
  id: number;
  name: string;
  constellationId?: number;
  regionId?: number;
}

interface SolarSystemApiResponse {
  data: SolarSystemApiRecord[];
  metadata: {
    total: number;
    limit: number;
    offset: number;
  };
}

const PAGE_SIZE = 1000;
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.resolve(
  SCRIPT_DIR,
  "../lib/eve/solar-systems.snapshot.json",
);

async function main() {
  const snapshot = new Map<number, SolarSystemApiRecord>();
  let offset = 0;
  let total = 0;

  do {
    const page = await fetchSolarSystemsPage(offset);

    total = page.metadata.total;
    offset += page.data.length;

    for (const record of page.data) {
      snapshot.set(record.id, {
        id: record.id,
        name: record.name,
        ...(record.constellationId ? { constellationId: record.constellationId } : {}),
        ...(record.regionId ? { regionId: record.regionId } : {}),
      });
    }
  } while (offset < total);

  const serializedSnapshot = Object.fromEntries(
    Array.from(snapshot.entries())
      .sort(([leftId], [rightId]) => leftId - rightId)
      .map(([solarSystemId, record]) => [String(solarSystemId), record]),
  );

  await writeFile(OUTPUT_PATH, `${JSON.stringify(serializedSnapshot, null, 2)}\n`);

  console.log(`Synced ${snapshot.size} solar systems to ${OUTPUT_PATH}`);
}

async function fetchSolarSystemsPage(offset: number) {
  const url = new URL("/v2/solarsystems", eveEnv.worldApiUrl);

  url.searchParams.set("limit", String(PAGE_SIZE));
  url.searchParams.set("offset", String(offset));

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`World API request failed with status ${response.status}`);
  }

  return response.json() as Promise<SolarSystemApiResponse>;
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
