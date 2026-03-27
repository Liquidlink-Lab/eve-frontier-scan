import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { eveEnv } from "../lib/eve/env";

interface WorldTypeApiRecord {
  id: number;
  name: string;
  groupName?: string;
  categoryName?: string;
  iconUrl?: string;
}

interface WorldTypeApiResponse {
  data: WorldTypeApiRecord[];
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
  "../lib/eve/world-types.snapshot.json",
);

async function main() {
  const snapshot = new Map<number, WorldTypeApiRecord>();
  let offset = 0;
  let total = 0;

  do {
    const page = await fetchTypesPage(offset);

    total = page.metadata.total;
    offset += page.data.length;

    for (const record of page.data) {
      snapshot.set(record.id, {
        id: record.id,
        name: record.name,
        ...(record.groupName ? { groupName: record.groupName } : {}),
        ...(record.categoryName ? { categoryName: record.categoryName } : {}),
        ...(record.iconUrl ? { iconUrl: record.iconUrl } : {}),
      });
    }
  } while (offset < total);

  const serializedSnapshot = Object.fromEntries(
    Array.from(snapshot.entries())
      .sort(([leftId], [rightId]) => leftId - rightId)
      .map(([typeId, record]) => [String(typeId), record]),
  );

  await writeFile(OUTPUT_PATH, `${JSON.stringify(serializedSnapshot, null, 2)}\n`);

  console.log(`Synced ${snapshot.size} world types to ${OUTPUT_PATH}`);
}

async function fetchTypesPage(offset: number) {
  const url = new URL("/v2/types", eveEnv.worldApiUrl);

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

  return response.json() as Promise<WorldTypeApiResponse>;
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
