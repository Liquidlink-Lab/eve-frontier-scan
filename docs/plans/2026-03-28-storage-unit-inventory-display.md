# Storage Unit Inventory Display Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Show owner/main inventory items on `StorageUnit` assembly detail pages with item names resolved from a local world type snapshot.

**Architecture:** Keep live inventory state on the request path by querying the storage unit's owner inventory dynamic field from Sui GraphQL. Keep item metadata off the request path by reading a repo-local world type snapshot generated from the World API. Join the two server-side and render a simple inventory table only for `::storage_unit::StorageUnit` assemblies.

**Tech Stack:** Next.js App Router server components, Vitest, Sui GraphQL dynamic fields, local JSON snapshot data, Bun script runtime.

---

### Task 1: Define Inventory Domain Types

**Files:**
- Modify: `lib/eve/types.ts`
- Test: `lib/eve/discovery/storageInventoryDiscovery.test.ts`

**Step 1: Write the failing test**

Add a test fixture that expects parsed owner inventory items to expose:
- `typeId`
- `itemId`
- `quantity`
- `volume`
- `itemName`

**Step 2: Run test to verify it fails**

Run: `bunx vitest run lib/eve/discovery/storageInventoryDiscovery.test.ts`
Expected: FAIL because inventory discovery module/types do not exist yet.

**Step 3: Write minimal implementation**

Add item summary types in `lib/eve/types.ts`:
- `StorageInventoryEntry`
- `StorageInventorySummary`

Extend `AssemblySummary` with optional storage inventory payload.

**Step 4: Run test to verify it passes**

Run: `bunx vitest run lib/eve/discovery/storageInventoryDiscovery.test.ts`
Expected: Still failing, but now on missing implementation instead of missing types.

### Task 2: Discover Owner Inventory From StorageUnit Dynamic Fields

**Files:**
- Create: `lib/eve/discovery/storageInventoryDiscovery.ts`
- Create: `lib/eve/discovery/storageInventoryDiscovery.test.ts`
- Modify: `app/dashboard/[characterId]/assemblies/[assemblyId]/page.tsx`

**Step 1: Write the failing test**

Write a focused test for:
- non-storage assemblies returning `null`
- storage units querying their own object address with `multiGetDynamicFields`
- parsing `items.contents` into item entries
- empty/missing inventory returning an empty inventory summary

**Step 2: Run test to verify it fails**

Run: `bunx vitest run lib/eve/discovery/storageInventoryDiscovery.test.ts`
Expected: FAIL because the discovery function does not exist.

**Step 3: Write minimal implementation**

Implement a discovery helper that:
- accepts `assembly`, `graphQl`, and `worldTypes`
- short-circuits unless `assembly.typeRepr.includes("::storage_unit::StorageUnit")`
- uses `assembly.id` as the parent address and `assembly.ownerCapId` as the dynamic field key
- parses GraphQL `value.json.items.contents`
- resolves names from the local type snapshot with fallback `Unknown item (type_id: X)`

**Step 4: Run test to verify it passes**

Run: `bunx vitest run lib/eve/discovery/storageInventoryDiscovery.test.ts`
Expected: PASS

### Task 3: Add Local World Type Snapshot Loader

**Files:**
- Create: `lib/eve/worldTypes.ts`
- Create: `lib/eve/worldTypes.test.ts`
- Create: `lib/eve/world-types.snapshot.json`

**Step 1: Write the failing test**

Write tests for:
- loading a known type by id
- returning `null` for missing ids
- building a lookup map for a set of requested type ids

**Step 2: Run test to verify it fails**

Run: `bunx vitest run lib/eve/worldTypes.test.ts`
Expected: FAIL because loader and snapshot file do not exist.

**Step 3: Write minimal implementation**

Create a loader that:
- imports local snapshot JSON
- normalizes it into `Map<number, WorldTypeRecord>`
- exposes helpers for by-id and batch lookup

Seed the snapshot with generated data from `/v2/types`.

**Step 4: Run test to verify it passes**

Run: `bunx vitest run lib/eve/worldTypes.test.ts`
Expected: PASS

### Task 4: Render Inventory Table On StorageUnit Detail Pages

**Files:**
- Modify: `features/assemblies/AssemblyDetailPage.tsx`
- Modify: `features/assemblies/AssemblyDetailPage.test.tsx`
- Modify: `app/dashboard/[characterId]/assemblies/[assemblyId]/page.tsx`

**Step 1: Write the failing test**

Add UI tests that expect:
- storage units render an `Inventory` heading and a table
- rows show `Item name | Quantity | Volume | Item ID | Type ID`
- non-storage assemblies do not render the inventory section

**Step 2: Run test to verify it fails**

Run: `bunx vitest run features/assemblies/AssemblyDetailPage.test.tsx`
Expected: FAIL because the UI does not render inventory yet.

**Step 3: Write minimal implementation**

Update the assembly detail route to:
- load world type snapshot
- discover storage inventory for the resolved assembly
- pass the inventory summary into `AssemblyDetailPage`

Update `AssemblyDetailPage` to render a simple table only when inventory data exists.

**Step 4: Run test to verify it passes**

Run: `bunx vitest run features/assemblies/AssemblyDetailPage.test.tsx`
Expected: PASS

### Task 5: Add World Type Snapshot Sync Script

**Files:**
- Create: `scripts/sync-world-types.ts`
- Modify: `package.json`

**Step 1: Write the failing test**

Skip unit tests for the script itself; instead define a deterministic output contract in comments and verify via a dry run command.

**Step 2: Run command to verify missing script**

Run: `bun run sync:world-types`
Expected: FAIL because script is not defined.

**Step 3: Write minimal implementation**

Add a Bun script that:
- fetches `/v2/types` pages until all records are collected
- writes `lib/eve/world-types.snapshot.json`
- stores only the fields needed for current UI

**Step 4: Run command to verify it passes**

Run: `bun run sync:world-types`
Expected: PASS and rewrite the snapshot file deterministically.

### Task 6: Verify End-To-End

**Files:**
- Verify: `lib/eve/discovery/storageInventoryDiscovery.test.ts`
- Verify: `lib/eve/worldTypes.test.ts`
- Verify: `features/assemblies/AssemblyDetailPage.test.tsx`
- Verify: full repo

**Step 1: Run targeted tests**

Run: `bunx vitest run lib/eve/discovery/storageInventoryDiscovery.test.ts lib/eve/worldTypes.test.ts features/assemblies/AssemblyDetailPage.test.tsx`
Expected: PASS

**Step 2: Run full verification**

Run:
- `bun run test`
- `bun run lint`
- `bun run build`

Expected: All pass.
