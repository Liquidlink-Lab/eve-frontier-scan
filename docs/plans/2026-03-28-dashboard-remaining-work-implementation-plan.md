# EVE Frontier Dashboard Remaining Work Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Finish the remaining MVP work after the Network Nodes index page: network node detail, assemblies flows, placeholder routes, and documentation/verification.

**Architecture:** Keep the existing App Router structure and extend the current `lib/eve` mapping layer instead of introducing a parallel data model. Reuse the wallet access query-string flow already used by `/dashboard/[characterId]/network-nodes`, and add the missing route helpers, detail mappers, and presentational components needed for read-only inspection pages.

**Tech Stack:** Next.js App Router, React 19, TypeScript, MUI, TanStack Query, Vitest, Testing Library.

## Critical Review Notes

- The repo is already beyond Task 7 in the original plan, so this continuation plan only covers the remaining work.
- `node_modules/` is missing locally, so verification cannot start until dependencies are installed.
- Project instructions require reading the relevant Next.js docs under `node_modules/next/dist/docs/` before editing app-router code. Install dependencies first, then read the route/layout guidance before implementation.
- `features/dashboard/Sidebar.tsx` currently renders `Assemblies`, `Ships`, and `Gates` as disabled items; those need real hrefs once the routes exist.

### Task 1: Restore Local Tooling Baseline

**Files:**
- Modify: `/home/astu9702/projects/eve-frontier-scan/README.md`

**Step 1: Install dependencies**

Run in `/home/astu9702/projects/eve-frontier-scan`:

```bash
bun install
```

Expected: install succeeds and `node_modules/` exists.

**Step 2: Read the relevant Next.js local docs**

Run:

```bash
find node_modules/next/dist/docs -maxdepth 2 -type f | sort
```

Then open the App Router docs relevant to nested `layout.tsx`, dynamic routes, and metadata before editing route files.

Expected: identify the specific local docs covering App Router route segment files used by this repo.

**Step 3: Verify the current baseline**

Run:

```bash
bun run test
bun run lint
```

Expected: understand the real failing baseline before new changes.

### Task 2: Add the Network Node Detail Flow

**Files:**
- Create: `/home/astu9702/projects/eve-frontier-scan/app/dashboard/[characterId]/network-nodes/[nodeId]/page.tsx`
- Create: `/home/astu9702/projects/eve-frontier-scan/features/network-nodes/ConnectedAssembliesList.tsx`
- Create: `/home/astu9702/projects/eve-frontier-scan/features/network-nodes/NetworkNodeDetailPage.tsx`
- Create: `/home/astu9702/projects/eve-frontier-scan/features/network-nodes/NetworkNodeFuelFields.tsx`
- Create: `/home/astu9702/projects/eve-frontier-scan/features/network-nodes/NetworkNodeDetailPage.test.tsx`
- Modify: `/home/astu9702/projects/eve-frontier-scan/lib/eve/types.ts`
- Modify: `/home/astu9702/projects/eve-frontier-scan/lib/eve/discovery/eveOwnershipMappers.ts`
- Modify: `/home/astu9702/projects/eve-frontier-scan/lib/eve/discovery/eveOwnershipMappers.test.ts`

**Step 1: Write the failing detail tests**

Add tests for:

- a mapped node detail object that preserves fuel, status, connected assembly summaries, and fallback labels
- the rendered detail page showing node name, short object id, Suiscan object link, status, solar system fallback, raw fuel values, and connected assemblies grouped by type

**Step 2: Run the focused tests to verify RED**

Run:

```bash
bunx vitest run \
  lib/eve/discovery/eveOwnershipMappers.test.ts \
  features/network-nodes/NetworkNodeDetailPage.test.tsx
```

Expected: FAIL because the detail mapper/page do not exist yet.

**Step 3: Implement the minimal detail data shape and UI**

Add:

- a mapper that resolves one network node by `characterId` and `nodeId`
- grouped connected assembly buckets for `Gate`, `Storage`, `Shipyard-like / ship-support`, and `Other`
- a detail page component that links the object id to Suiscan and renders simple list sections

**Step 4: Re-run the focused tests**

Run:

```bash
bunx vitest run \
  lib/eve/discovery/eveOwnershipMappers.test.ts \
  features/network-nodes/NetworkNodeDetailPage.test.tsx
```

Expected: PASS.

### Task 3: Add Assemblies Navigation, Pages, and Placeholder Sections

**Files:**
- Create: `/home/astu9702/projects/eve-frontier-scan/app/dashboard/[characterId]/assemblies/page.tsx`
- Create: `/home/astu9702/projects/eve-frontier-scan/app/dashboard/[characterId]/assemblies/[assemblyId]/page.tsx`
- Create: `/home/astu9702/projects/eve-frontier-scan/app/dashboard/[characterId]/ships/page.tsx`
- Create: `/home/astu9702/projects/eve-frontier-scan/app/dashboard/[characterId]/gates/page.tsx`
- Create: `/home/astu9702/projects/eve-frontier-scan/features/assemblies/AssembliesPage.tsx`
- Create: `/home/astu9702/projects/eve-frontier-scan/features/assemblies/AssemblyDetailPage.tsx`
- Create: `/home/astu9702/projects/eve-frontier-scan/features/assemblies/AssemblyGroupSection.tsx`
- Create: `/home/astu9702/projects/eve-frontier-scan/features/assemblies/AssemblyRow.tsx`
- Create: `/home/astu9702/projects/eve-frontier-scan/features/assemblies/AssembliesPage.test.tsx`
- Create: `/home/astu9702/projects/eve-frontier-scan/features/assemblies/AssemblyDetailPage.test.tsx`
- Modify: `/home/astu9702/projects/eve-frontier-scan/features/dashboard/Sidebar.tsx`
- Modify: `/home/astu9702/projects/eve-frontier-scan/lib/eve/routes.ts`
- Modify: `/home/astu9702/projects/eve-frontier-scan/lib/eve/types.ts`
- Modify: `/home/astu9702/projects/eve-frontier-scan/lib/eve/discovery/eveOwnershipMappers.ts`
- Modify: `/home/astu9702/projects/eve-frontier-scan/lib/eve/discovery/eveOwnershipMappers.test.ts`

**Step 1: Write the failing assemblies tests**

Add tests for:

- assemblies grouped page rendering only populated groups
- row details link, fallback naming, and wiki link behavior
- generic assembly detail rendering object id, type label, status, and optional wiki link
- sidebar nav items linking to the new `Assemblies`, `Ships`, and `Gates` routes when access context exists

**Step 2: Run the focused tests to verify RED**

Run:

```bash
bunx vitest run \
  features/dashboard/DashboardShell.test.tsx \
  features/assemblies/AssembliesPage.test.tsx \
  features/assemblies/AssemblyDetailPage.test.tsx \
  lib/eve/discovery/eveOwnershipMappers.test.ts
```

Expected: FAIL because the assemblies UI/routes are missing and sidebar nav is incomplete.

**Step 3: Implement the minimal assemblies flow**

Add:

- route helpers for assemblies index/detail and placeholder sections
- grouped assemblies page backed by the existing `mapDiscoveryToAssembliesByType`
- generic assembly detail view with Suiscan and wiki links
- simple placeholder content for `Ships` and `Gates`
- sidebar links replacing the current disabled nav buttons

**Step 4: Re-run the focused tests**

Run:

```bash
bunx vitest run \
  features/dashboard/DashboardShell.test.tsx \
  features/assemblies/AssembliesPage.test.tsx \
  features/assemblies/AssemblyDetailPage.test.tsx \
  lib/eve/discovery/eveOwnershipMappers.test.ts
```

Expected: PASS.

### Task 4: Verify and Align Documentation

**Files:**
- Modify: `/home/astu9702/projects/eve-frontier-scan/README.md`

**Step 1: Run the full verification suite**

Run:

```bash
bun run test
bun run lint
bun run build
```

Expected: PASS, PASS, PASS.

**Step 2: Replace the placeholder README**

Document:

- the app purpose
- lookup routes and dashboard routes
- required environment variables from `.envsample`
- how wallet lookup differs from `My dashboard`

**Step 3: Run the build again if README edits were the final change**

Run:

```bash
bun run build
```

Expected: PASS.
