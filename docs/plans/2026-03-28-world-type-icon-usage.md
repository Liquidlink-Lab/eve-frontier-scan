# World Type Icon Usage Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Surface world type icons across the dashboard so structure and inventory views are easier to scan without turning the app into a gallery.

**Architecture:** Extend world-type-derived lookups so summary mappers can carry `iconUrl` into network node, assembly, connected assembly, and inventory item summaries. Render those icons through a shared `TypeIcon` component that handles both real remote images and a compact fallback badge, so the UI stays consistent even when the snapshot has no icon for a type.

**Tech Stack:** Next.js App Router, React 19, MUI, Vitest, local world type snapshot JSON

### Task 1: Add icon-aware summary data

**Files:**
- Modify: `lib/eve/types.ts`
- Modify: `lib/eve/lookups.ts`
- Modify: `lib/eve/worldTypes.ts`
- Modify: `lib/eve/discovery/eveOwnershipMappers.ts`
- Modify: `lib/eve/discovery/storageInventoryDiscovery.ts`
- Test: `lib/eve/lookups.test.ts`
- Test: `lib/eve/discovery/eveOwnershipMappers.test.ts`
- Test: `lib/eve/discovery/storageInventoryDiscovery.test.ts`

**Step 1: Write the failing tests**

Extend tests so they expect:
- `createLabelLookupsWithWorldTypes(...)` to expose type icon URLs
- network node, assembly, connected assembly, and assembly detail summaries to carry `iconUrl`
- storage inventory item summaries to carry `iconUrl`

**Step 2: Run tests to verify they fail**

Run:
- `bunx vitest run lib/eve/lookups.test.ts`
- `bunx vitest run lib/eve/discovery/eveOwnershipMappers.test.ts`
- `bunx vitest run lib/eve/discovery/storageInventoryDiscovery.test.ts`

Expected: FAIL because icon data is not mapped yet.

**Step 3: Write minimal implementation**

Add optional `iconUrl` fields to the relevant summary types. Extend `LabelLookups` with a type-icon map sourced from world types with icons. In the mappers and storage inventory discovery, resolve icon URLs once and persist them on summaries.

**Step 4: Run tests to verify they pass**

Run the same three commands again.

Expected: PASS

### Task 2: Add a shared type icon component

**Files:**
- Create: `features/icons/TypeIcon.tsx`
- Test: `features/icons/TypeIcon.test.tsx`

**Step 1: Write the failing test**

Add a test that expects:
- an `<img>` with the correct `src` and alt text when `iconUrl` is present
- a labeled fallback badge when `iconUrl` is missing

**Step 2: Run test to verify it fails**

Run: `bunx vitest run features/icons/TypeIcon.test.tsx`

Expected: FAIL because the component does not exist.

**Step 3: Write minimal implementation**

Create a compact icon component that:
- renders a rounded image box for a real icon
- renders a neutral fallback monogram badge when no icon exists
- supports a `size` prop for list rows vs detail headers

**Step 4: Run test to verify it passes**

Run: `bunx vitest run features/icons/TypeIcon.test.tsx`

Expected: PASS

### Task 3: Render icons in list rows and related assemblies

**Files:**
- Create: `features/assemblies/AssemblyRow.test.tsx`
- Modify: `features/assemblies/AssemblyRow.tsx`
- Modify: `features/network-nodes/NetworkNodeTableRow.test.tsx`
- Modify: `features/network-nodes/NetworkNodeTableRow.tsx`
- Modify: `features/network-nodes/ConnectedAssembliesList.test.tsx`
- Modify: `features/network-nodes/ConnectedAssembliesList.tsx`

**Step 1: Write the failing tests**

Add tests so they expect:
- an assembly row icon beside the assembly name
- a network node row icon beside the node name
- related assemblies to show icons beside their names

**Step 2: Run tests to verify they fail**

Run:
- `bunx vitest run features/assemblies/AssemblyRow.test.tsx`
- `bunx vitest run features/network-nodes/NetworkNodeTableRow.test.tsx`
- `bunx vitest run features/network-nodes/ConnectedAssembliesList.test.tsx`

Expected: FAIL because the rows do not render icons yet.

**Step 3: Write minimal implementation**

Use the shared `TypeIcon` component in those rows with compact sizes and keep the existing layout stable on mobile.

**Step 4: Run tests to verify they pass**

Run the same three commands again.

Expected: PASS

### Task 4: Render icons in detail headers and storage inventory

**Files:**
- Modify: `features/assemblies/AssemblyDetailPage.test.tsx`
- Modify: `features/assemblies/AssemblyDetailPage.tsx`
- Modify: `features/network-nodes/NetworkNodeDetailPage.test.tsx`
- Modify: `features/network-nodes/NetworkNodeDetailPage.tsx`

**Step 1: Write the failing tests**

Extend tests so they expect:
- assembly detail header to show the assembly type icon
- network node detail header to show the node icon
- storage inventory rows to show item icons when available

**Step 2: Run tests to verify they fail**

Run:
- `bunx vitest run features/assemblies/AssemblyDetailPage.test.tsx`
- `bunx vitest run features/network-nodes/NetworkNodeDetailPage.test.tsx`

Expected: FAIL because the detail pages do not render icons yet.

**Step 3: Write minimal implementation**

Render a larger header icon beside the title block in both detail pages. In the storage inventory table, show a small icon inline with the item name while preserving the existing columns.

**Step 4: Run tests to verify they pass**

Run the same two commands again.

Expected: PASS

### Task 5: Final verification

**Files:**
- Modify: any touched files if fixes are required

**Step 1: Run focused verification**

Run:
- `bunx vitest run lib/eve/lookups.test.ts`
- `bunx vitest run lib/eve/discovery/eveOwnershipMappers.test.ts`
- `bunx vitest run lib/eve/discovery/storageInventoryDiscovery.test.ts`
- `bunx vitest run features/icons/TypeIcon.test.tsx`
- `bunx vitest run features/assemblies/AssemblyRow.test.tsx`
- `bunx vitest run features/network-nodes/NetworkNodeTableRow.test.tsx`
- `bunx vitest run features/network-nodes/ConnectedAssembliesList.test.tsx`
- `bunx vitest run features/assemblies/AssemblyDetailPage.test.tsx`
- `bunx vitest run features/network-nodes/NetworkNodeDetailPage.test.tsx`

Expected: PASS

**Step 2: Run full verification**

Run:
- `bun run test`
- `bun run lint`
- `bun run build`

Expected: PASS
