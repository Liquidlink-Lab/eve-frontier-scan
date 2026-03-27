# Gate And Turret Detail Enhancements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Expand assembly detail pages so Gate and Turret structures surface richer operational data from on-chain object fields, shared config, and recent events.

**Architecture:** Extend discovery to preserve more raw Gate/Turret fields from object JSON, map those fields into a dedicated assembly detail summary, and keep generic assembly index rows unchanged. Add a second discovery layer for GateConfig and recent gate/turret events using GraphQL dynamic fields and Sui JSON-RPC so detail pages can render recent activity and config safely, with empty states when no activity exists.

**Tech Stack:** Next.js App Router, React 19, MUI, Vitest, Sui GraphQL, Sui JSON-RPC, `@mysten/sui/bcs`

### Task 1: Define richer detail models

**Files:**
- Modify: `lib/eve/types.ts`
- Test: `features/assemblies/AssemblyDetailPage.test.tsx`

**Step 1: Write the failing tests**

Extend `features/assemblies/AssemblyDetailPage.test.tsx` so a Gate/Turret detail summary is expected to render extra rows for:
- `Description`
- `Reference URL`
- `Tenant item ID`
- `Tenant`
- `Owner Cap`
- `Powered by`
- `Extension`

Add Gate-specific expectations for:
- `Linked gate`
- `Access mode`

**Step 2: Run test to verify it fails**

Run: `bunx vitest run features/assemblies/AssemblyDetailPage.test.tsx`
Expected: FAIL because the detail page does not render the new rows.

**Step 3: Write minimal implementation**

Add detail-only types in `lib/eve/types.ts` for:
- `AssemblyDetailSummary`
- `GateJumpSummary`
- `GatePermitSummary`
- `TurretPriorityTargetSummary`
- `TurretPrioritySnapshotSummary`

**Step 4: Run test to verify progress**

Run: `bunx vitest run features/assemblies/AssemblyDetailPage.test.tsx`
Expected: still FAIL until rendering is added.

### Task 2: Preserve direct Gate/Turret fields during discovery

**Files:**
- Modify: `lib/eve/types.ts`
- Modify: `lib/eve/discovery/assemblyDiscovery.ts`
- Modify: `lib/eve/discovery/eveOwnershipMappers.ts`
- Test: `lib/eve/discovery/assemblyDiscovery.test.ts`
- Test: `lib/eve/discovery/eveOwnershipMappers.test.ts`

**Step 1: Write the failing tests**

Add discovery test coverage for parsing:
- `metadata.description`
- `metadata.url`
- `key.item_id`
- `key.tenant`
- `energy_source_id`
- `linked_gate_id`
- `extension.name`

Add mapper coverage that an assembly detail summary resolves:
- energy source name from known network nodes
- linked gate name from known structures
- gate access mode from extension presence

**Step 2: Run test to verify it fails**

Run: `bunx vitest run lib/eve/discovery/assemblyDiscovery.test.ts lib/eve/discovery/eveOwnershipMappers.test.ts`
Expected: FAIL because those fields are not preserved or mapped.

**Step 3: Write minimal implementation**

In `assemblyDiscovery.ts`, parse and store the new raw fields on `DiscoveredStructure`.

In `eveOwnershipMappers.ts`, add a new `mapDiscoveryToAssemblyDetail(...)` helper that:
- resolves an assembly by id
- reuses world type lookups for display labels
- resolves energy source / linked gate names from known structures
- maps Gate access mode to `Public` or `Permit required`

**Step 4: Run test to verify it passes**

Run: `bunx vitest run lib/eve/discovery/assemblyDiscovery.test.ts lib/eve/discovery/eveOwnershipMappers.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/eve/types.ts lib/eve/discovery/assemblyDiscovery.ts lib/eve/discovery/eveOwnershipMappers.ts lib/eve/discovery/assemblyDiscovery.test.ts lib/eve/discovery/eveOwnershipMappers.test.ts features/assemblies/AssemblyDetailPage.test.tsx
git commit -m "feat: enrich gate and turret detail fields"
```

### Task 3: Render the direct detail fields in the UI

**Files:**
- Modify: `app/dashboard/[characterId]/assemblies/[assemblyId]/page.tsx`
- Modify: `features/assemblies/AssemblyDetailPage.tsx`
- Test: `features/assemblies/AssemblyDetailPage.test.tsx`

**Step 1: Write the failing test**

Extend the assembly detail UI test to expect the new labels and values to appear in the details panel for a Gate/Turret summary.

**Step 2: Run test to verify it fails**

Run: `bunx vitest run features/assemblies/AssemblyDetailPage.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**

Update the page route to use `mapDiscoveryToAssemblyDetail(...)` instead of flattening the grouped list. Render the extra detail rows in `AssemblyDetailPage.tsx`, with:
- links for reference URL
- monospace formatting for ids / extension type
- graceful `Unavailable` fallbacks

**Step 4: Run test to verify it passes**

Run: `bunx vitest run features/assemblies/AssemblyDetailPage.test.tsx`
Expected: PASS

### Task 4: Add GateConfig and activity discovery

**Files:**
- Modify: `lib/eve/env.ts`
- Create: `lib/eve/discovery/suiRpcClient.ts`
- Create: `lib/eve/discovery/gateActivityDiscovery.ts`
- Create: `lib/eve/discovery/gateConfigDiscovery.ts`
- Create: `lib/eve/discovery/turretActivityDiscovery.ts`
- Test: `lib/eve/discovery/gateActivityDiscovery.test.ts`
- Test: `lib/eve/discovery/gateConfigDiscovery.test.ts`
- Test: `lib/eve/discovery/turretActivityDiscovery.test.ts`

**Step 1: Write the failing tests**

Add tests that cover:
- scanning recent `GateLinkedEvent`, `JumpEvent`, `JumpPermitIssuedEvent` pages and filtering by gate id
- fetching `GateConfig` table entry by `type_id`
- scanning recent `PriorityListUpdatedEvent` pages and reducing the latest snapshot for a turret
- handling empty event results safely

**Step 2: Run test to verify it fails**

Run: `bunx vitest run lib/eve/discovery/gateActivityDiscovery.test.ts lib/eve/discovery/gateConfigDiscovery.test.ts lib/eve/discovery/turretActivityDiscovery.test.ts`
Expected: FAIL because the modules do not exist yet.

**Step 3: Write minimal implementation**

Implement:
- a small JSON-RPC client with `cache: "no-store"`
- event scanners with bounded page depth
- a `GateConfig` fetcher that reads the shared object and then the `max_distance_by_type` table with a `u64` dynamic field key

**Step 4: Run test to verify it passes**

Run: `bunx vitest run lib/eve/discovery/gateActivityDiscovery.test.ts lib/eve/discovery/gateConfigDiscovery.test.ts lib/eve/discovery/turretActivityDiscovery.test.ts`
Expected: PASS

### Task 5: Render Gate/Turret operational history

**Files:**
- Modify: `app/dashboard/[characterId]/assemblies/[assemblyId]/page.tsx`
- Modify: `features/assemblies/AssemblyDetailPage.tsx`
- Test: `features/assemblies/AssemblyDetailPage.test.tsx`

**Step 1: Write the failing tests**

Extend assembly detail tests to expect:
- Gate: `Max link distance`, `Recent jumps`, `Recent permits`
- Turret: `Latest target priority snapshot`
- empty states when no recent events exist

**Step 2: Run test to verify it fails**

Run: `bunx vitest run features/assemblies/AssemblyDetailPage.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**

In the page route, conditionally fetch:
- gate config + gate activity for Gate
- turret activity for Turret

Render compact sections in `AssemblyDetailPage.tsx`:
- Gate operational card
- Recent jumps list
- Recent permits list
- Turret priority table / list

**Step 4: Run test to verify it passes**

Run: `bunx vitest run features/assemblies/AssemblyDetailPage.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/eve/env.ts lib/eve/discovery/suiRpcClient.ts lib/eve/discovery/gateActivityDiscovery.ts lib/eve/discovery/gateConfigDiscovery.ts lib/eve/discovery/turretActivityDiscovery.ts lib/eve/discovery/gateActivityDiscovery.test.ts lib/eve/discovery/gateConfigDiscovery.test.ts lib/eve/discovery/turretActivityDiscovery.test.ts app/dashboard/[characterId]/assemblies/[assemblyId]/page.tsx features/assemblies/AssemblyDetailPage.tsx features/assemblies/AssemblyDetailPage.test.tsx
git commit -m "feat: surface gate and turret activity insights"
```

### Task 6: Final verification

**Files:**
- Modify: any touched files from tasks above if fixes are needed

**Step 1: Run focused tests**

Run:
- `bunx vitest run features/assemblies/AssemblyDetailPage.test.tsx`
- `bunx vitest run lib/eve/discovery/assemblyDiscovery.test.ts lib/eve/discovery/eveOwnershipMappers.test.ts`
- `bunx vitest run lib/eve/discovery/gateActivityDiscovery.test.ts lib/eve/discovery/gateConfigDiscovery.test.ts lib/eve/discovery/turretActivityDiscovery.test.ts`

Expected: PASS

**Step 2: Run full verification**

Run:
- `bun run test`
- `bun run lint`
- `bun run build`

Expected: PASS
