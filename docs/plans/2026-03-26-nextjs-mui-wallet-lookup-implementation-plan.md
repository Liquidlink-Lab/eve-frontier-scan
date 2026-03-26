# EVE Frontier Next.js Wallet Lookup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Next.js + MUI EVE Frontier wallet lookup application that resolves wallet-linked characters, defaults into character-scoped `Network Nodes`, and supports `Assemblies` plus minimal `Ships` / `Gates` placeholders.

**Architecture:** Use the current repository at `/home/leon/eve-frontier-scan` as the app root. Keep App Router routes in `/home/leon/eve-frontier-scan/app`, and add root-level `features`, `lib`, `theme`, and `test` directories as the app grows. Treat `/home/leon/eve_hackathon/apps/solo-web` as a reference-only source for reusable data logic. Keep the app lookup-first: the homepage resolves a SUI address, then routes into `0 / 1 / many` character outcomes. Once inside a character, render a dark wiki-like shell with a fixed sidebar, `Network Nodes` as the default page, dedicated detail pages, and a connected-wallet menu that does not overwrite public lookup state.

**Tech Stack:** Next.js App Router, React 19, TypeScript, MUI, TanStack Query, `@evefrontier/dapp-kit`, `@mysten/dapp-kit-react`, `@mysten/sui`, Vitest, Testing Library, jsdom.

## Execution Notes

- Workspace root: `/home/leon/eve-frontier-scan`
- App root: `/home/leon/eve-frontier-scan`
- Legacy reference app: `/home/leon/eve_hackathon/apps/solo-web`
- Proposal reference: `/home/leon/eve-frontier-scan/docs/plans/eve-frontier-player-dashboard-proposal.md`
- This repository already contains a generated Next.js app at the root. Do not create `apps/lookup-web/` and do not migrate the project into `src/`.
- Keep using the existing root-level App Router structure under `app/`.
- Prefer `bun` commands in this repo because the current lockfile is `bun.lock`.
- This plan assumes the app remains standalone. Do not reuse old UI code. Only reuse data discovery and mapper logic where it remains correct.
- During implementation, follow `@superpowers:test-driven-development`.
- Before declaring success, follow `@superpowers:verification-before-completion`.

## Route Map

- `/`
  - lookup-first homepage
- `/lookup/[address]`
  - zero-result empty state or redirect point
- `/lookup/[address]/characters`
  - character selection page for multi-character results
- `/me`
  - connected wallet entry point for `My dashboard`
- `/dashboard/[characterId]/network-nodes`
  - default character page
- `/dashboard/[characterId]/network-nodes/[nodeId]`
  - Network Node detail page
- `/dashboard/[characterId]/assemblies`
  - grouped assemblies page
- `/dashboard/[characterId]/assemblies/[assemblyId]`
  - generic assembly detail page
- `/dashboard/[characterId]/ships`
  - placeholder page
- `/dashboard/[characterId]/gates`
  - placeholder page

## Shared Product Rules

- Homepage has no marketing copy.
- Homepage shows only:
  - logo
  - SUI address input
  - `Connect EVE Vault`
- Address lookup is the primary CTA.
- `Connect EVE Vault` is secondary.
- Wallet lookup and connected-wallet state must coexist without overwriting the current page.
- Character routing logic is identical for lookup and `My dashboard`:
  - `0` characters: empty state
  - `1` character: go directly to `Network Nodes`
  - `>1` characters: show character selection
- Sidebar only appears inside `/dashboard/[characterId]/*`.
- Sidebar top section shows:
  - source label
  - short wallet address
  - Suiscan external link
  - character switcher
- Sidebar nav shows:
  - `Network Nodes`
  - `Assemblies`
  - `Ships`
  - `Gates`

---

### Task 0: Align the Existing Next.js App Scaffold

**Files:**
- Modify: `/home/leon/eve-frontier-scan/package.json`
- Modify: `/home/leon/eve-frontier-scan/next.config.ts`
- Modify: `/home/leon/eve-frontier-scan/tsconfig.json`
- Create: `/home/leon/eve-frontier-scan/.envsample`
- Modify: `/home/leon/eve-frontier-scan/app/layout.tsx`
- Modify: `/home/leon/eve-frontier-scan/app/page.tsx`
- Modify: `/home/leon/eve-frontier-scan/app/globals.css`

**Step 1: Confirm the existing Next.js scaffold**

Run in `/home/leon/eve-frontier-scan`:

```bash
test -f package.json && test -f app/page.tsx && test -f app/layout.tsx
```

Expected: PASS. The repository is already the app root, so do not run `create-next-app` again.

**Step 2: Add required dependencies**

Run in `/home/leon/eve-frontier-scan`:

```bash
bun add @mui/material @mui/icons-material @emotion/react @emotion/styled @tanstack/react-query @evefrontier/dapp-kit @mysten/dapp-kit-react @mysten/sui
bun add -d vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Expected: install succeeds and `package.json` includes MUI, wallet, query, and test dependencies. Add a `test` script for Vitest while updating `package.json`.

**Step 3: Verify the clean baseline**

Run in `/home/leon/eve-frontier-scan`:

```bash
bun run lint
bun run build
```

Expected: PASS, PASS.

**Step 4: Commit**

```bash
git add app package.json bun.lock next.config.ts tsconfig.json .envsample
git commit -m "feat: align nextjs scaffold for wallet lookup app"
```

---

### Task 1: Add Theme, Providers, and Test Harness

**Files:**
- Create: `/home/leon/eve-frontier-scan/vitest.config.mts`
- Create: `/home/leon/eve-frontier-scan/test/setup.ts`
- Create: `/home/leon/eve-frontier-scan/test/renderWithProviders.tsx`
- Create: `/home/leon/eve-frontier-scan/app/providers.tsx`
- Create: `/home/leon/eve-frontier-scan/theme/theme.ts`
- Modify: `/home/leon/eve-frontier-scan/app/layout.tsx`
- Create: `/home/leon/eve-frontier-scan/app/page.test.tsx`

**Step 1: Write the failing homepage shell test**

Create `app/page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";

import HomePage from "./page";

it("renders a lookup-first homepage", () => {
  render(<HomePage />);
  expect(screen.getByRole("textbox")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /connect eve vault/i })).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run:

```bash
bunx vitest run app/page.test.tsx
```

Expected: FAIL because Vitest config and shared providers do not exist yet.

**Step 3: Add providers and theme**

Create a minimal provider stack:

- `app/providers.tsx`
  - `ThemeProvider`
  - `QueryClientProvider`
- `theme/theme.ts`
  - dark MUI theme tuned for wiki-like density
- `test/setup.ts`
  - `@testing-library/jest-dom`
- `test/renderWithProviders.tsx`
  - shared render helper
- `vitest.config.mts`
  - jsdom config

**Step 4: Re-run focused tests**

Run:

```bash
bunx vitest run app/page.test.tsx
```

Expected: PASS.

**Step 5: Run full baseline**

Run:

```bash
bun run lint
bun run build
```

Expected: PASS, PASS.

**Step 6: Commit**

```bash
git add app theme test vitest.config.mts package.json bun.lock
git commit -m "feat: add providers and mui theme"
```

---

### Task 2: Port Reusable Data and Domain Logic

**Files:**
- Create: `/home/leon/eve-frontier-scan/lib/eve/types.ts`
- Create: `/home/leon/eve-frontier-scan/lib/eve/env.ts`
- Create: `/home/leon/eve-frontier-scan/lib/eve/address.ts`
- Create: `/home/leon/eve-frontier-scan/lib/eve/suiscan.ts`
- Create: `/home/leon/eve-frontier-scan/lib/eve/wikiLinks.ts`
- Create: `/home/leon/eve-frontier-scan/lib/eve/discovery/assemblyDiscovery.ts`
- Create: `/home/leon/eve-frontier-scan/lib/eve/discovery/eveOwnershipClient.ts`
- Create: `/home/leon/eve-frontier-scan/lib/eve/discovery/eveOwnershipMappers.ts`
- Create: `/home/leon/eve-frontier-scan/lib/eve/discovery/assemblyDiscovery.test.ts`
- Create: `/home/leon/eve-frontier-scan/lib/eve/discovery/eveOwnershipMappers.test.ts`

**Reference Files:**
- `/home/leon/eve_hackathon/apps/solo-web/src/lib/data/live/assemblyDiscovery.ts`
- `/home/leon/eve_hackathon/apps/solo-web/src/lib/data/live/eveOwnershipClient.ts`
- `/home/leon/eve_hackathon/apps/solo-web/src/lib/data/live/eveOwnershipMappers.ts`
- `/home/leon/eve_hackathon/apps/solo-web/src/features/auth/suiAddress.ts`

**Step 1: Copy the discovery tests first**

Port the current discovery and mapper tests into the new app with updated import paths.

**Step 2: Run tests to verify they fail**

Run:

```bash
bunx vitest run lib/eve/discovery/assemblyDiscovery.test.ts lib/eve/discovery/eveOwnershipMappers.test.ts
```

Expected: FAIL because the new modules do not exist yet.

**Step 3: Implement the ported data layer**

Move only the reusable logic:

- wallet address normalization
- wallet -> PlayerProfile -> character -> owner-cap discovery
- structure mapping
- short-id formatting helpers
- Suiscan link helper
- wiki link mapping helper for known assembly types

Do not port old UI-oriented contract labels or page-specific presentation code.

**Step 4: Re-run tests**

Run:

```bash
bunx vitest run lib/eve/discovery/assemblyDiscovery.test.ts lib/eve/discovery/eveOwnershipMappers.test.ts
```

Expected: PASS.

**Step 5: Commit**

```bash
git add lib
git commit -m "feat: port reusable eve discovery and mapper logic"
```

---

### Task 3: Build the Lookup-First Homepage

**Files:**
- Modify: `/home/leon/eve-frontier-scan/app/page.tsx`
- Create: `/home/leon/eve-frontier-scan/features/home/LookupEntryForm.tsx`
- Create: `/home/leon/eve-frontier-scan/features/home/ConnectWalletButton.tsx`
- Create: `/home/leon/eve-frontier-scan/features/home/HomePage.test.tsx`
- Modify: `/home/leon/eve-frontier-scan/app/globals.css`

**Step 1: Write the failing homepage behavior test**

Test for:

- logo rendered
- address input shown above connect button
- no sidebar
- no marketing copy

```tsx
expect(screen.getByRole("textbox", { name: /sui address/i })).toBeInTheDocument();
expect(screen.getByRole("button", { name: /connect eve vault/i })).toBeInTheDocument();
expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
```

**Step 2: Run the test**

Run:

```bash
bunx vitest run features/home/HomePage.test.tsx
```

Expected: FAIL.

**Step 3: Implement the homepage**

Create a centered entry layout:

- logo at top
- address input
- submit button
- secondary `Connect EVE Vault` button below

On submit:

- normalize the address
- route to `/lookup/[address]`

**Step 4: Re-run tests**

Run:

```bash
bunx vitest run features/home/HomePage.test.tsx
```

Expected: PASS.

**Step 5: Commit**

```bash
git add app features lib
git commit -m "feat: add lookup-first homepage"
```

---

### Task 4: Implement Character Resolution Routes

**Files:**
- Create: `/home/leon/eve-frontier-scan/app/lookup/[address]/page.tsx`
- Create: `/home/leon/eve-frontier-scan/app/lookup/[address]/characters/page.tsx`
- Create: `/home/leon/eve-frontier-scan/app/me/page.tsx`
- Create: `/home/leon/eve-frontier-scan/features/characters/CharacterSelectionPage.tsx`
- Create: `/home/leon/eve-frontier-scan/features/characters/CharacterSelectionCard.tsx`
- Create: `/home/leon/eve-frontier-scan/features/lookup/LookupEmptyState.tsx`
- Create: `/home/leon/eve-frontier-scan/features/characters/CharacterSelectionPage.test.tsx`

**Step 1: Write the routing tests**

Test three outcomes:

- zero characters -> empty state
- one character -> redirect to `/dashboard/[characterId]/network-nodes`
- many characters -> render card selection page

**Step 2: Run the tests**

Run:

```bash
bunx vitest run features/characters/CharacterSelectionPage.test.tsx
```

Expected: FAIL.

**Step 3: Implement lookup resolution**

Use the ported discovery layer to:

- resolve the address
- derive character count
- route according to the shared `0 / 1 / many` rule

Character cards must show:

- name
- tribe
- wallet linkage
- owned Network Node count
- current ship

**Step 4: Implement `Try another address` empty state**

Empty state must show:

- `No EVE Frontier player record found for this address.`
- secondary explanation
- `Try another address`

**Step 5: Re-run tests**

Run:

```bash
bunx vitest run features/characters/CharacterSelectionPage.test.tsx
```

Expected: PASS.

**Step 6: Commit**

```bash
git add app features lib
git commit -m "feat: add character resolution and selection flow"
```

---

### Task 5: Build Wallet State and Top-Right Wallet Menu

**Files:**
- Create: `/home/leon/eve-frontier-scan/features/wallet/WalletMenu.tsx`
- Create: `/home/leon/eve-frontier-scan/features/wallet/WalletSessionProvider.tsx`
- Create: `/home/leon/eve-frontier-scan/features/wallet/useWalletSession.ts`
- Create: `/home/leon/eve-frontier-scan/features/wallet/WalletMenu.test.tsx`
- Modify: `/home/leon/eve-frontier-scan/app/layout.tsx`

**Step 1: Write the failing wallet menu test**

Test that when connected:

- short address is visible
- menu contains `My dashboard`
- menu contains `Disconnect`

**Step 2: Run the test**

Run:

```bash
bunx vitest run features/wallet/WalletMenu.test.tsx
```

Expected: FAIL.

**Step 3: Implement wallet session UI**

Requirements:

- wallet connect does not replace current public lookup route
- wallet control sits at top-right
- `My dashboard` routes to `/me`
- `Disconnect` clears wallet session only

**Step 4: Re-run tests**

Run:

```bash
bunx vitest run features/wallet/WalletMenu.test.tsx
```

Expected: PASS.

**Step 5: Commit**

```bash
git add app features
git commit -m "feat: add wallet session menu"
```

---

### Task 6: Build the Character Dashboard Shell

**Files:**
- Create: `/home/leon/eve-frontier-scan/app/dashboard/[characterId]/layout.tsx`
- Create: `/home/leon/eve-frontier-scan/features/dashboard/DashboardShell.tsx`
- Create: `/home/leon/eve-frontier-scan/features/dashboard/Sidebar.tsx`
- Create: `/home/leon/eve-frontier-scan/features/dashboard/CharacterSwitcher.tsx`
- Create: `/home/leon/eve-frontier-scan/features/dashboard/DashboardShell.test.tsx`

**Step 1: Write the failing shell test**

Assert:

- sidebar appears only under `/dashboard`
- sidebar shows source label
- sidebar shows short wallet address with Suiscan link
- sidebar shows simple character switcher
- nav items are `Network Nodes`, `Assemblies`, `Ships`, `Gates`

**Step 2: Run the test**

Run:

```bash
bunx vitest run features/dashboard/DashboardShell.test.tsx
```

Expected: FAIL.

**Step 3: Implement shell layout**

Use:

- MUI `Drawer` for sidebar
- compact dark list styling
- no large marketing or hero content

**Step 4: Re-run the test**

Run:

```bash
bunx vitest run features/dashboard/DashboardShell.test.tsx
```

Expected: PASS.

**Step 5: Commit**

```bash
git add app features
git commit -m "feat: add character dashboard shell"
```

---

### Task 7: Implement the Network Nodes Index Page

**Files:**
- Create: `/home/leon/eve-frontier-scan/app/dashboard/[characterId]/network-nodes/page.tsx`
- Create: `/home/leon/eve-frontier-scan/features/network-nodes/NetworkNodeTable.tsx`
- Create: `/home/leon/eve-frontier-scan/features/network-nodes/NetworkNodeTableRow.tsx`
- Create: `/home/leon/eve-frontier-scan/features/network-nodes/NetworkNodesPage.test.tsx`

**Step 1: Write the failing page test**

Assert:

- table columns render in order:
  - `Status`
  - `Name`
  - `Solar System`
  - `Fuel`
  - `Connected Assemblies`
- rows include `Details`
- rows are sorted by:
  - connected assemblies count descending
  - fuel remaining ascending

**Step 2: Run the test**

Run:

```bash
bunx vitest run features/network-nodes/NetworkNodesPage.test.tsx
```

Expected: FAIL.

**Step 3: Implement the page**

Requirements:

- no search
- no filters
- default character landing page
- if the character has no nodes, show an empty state suggesting character switch or checking `Assemblies`

**Step 4: Re-run the test**

Run:

```bash
bunx vitest run features/network-nodes/NetworkNodesPage.test.tsx
```

Expected: PASS.

**Step 5: Commit**

```bash
git add app features
git commit -m "feat: add network nodes index page"
```

---

### Task 8: Implement the Network Node Detail Page

**Files:**
- Create: `/home/leon/eve-frontier-scan/app/dashboard/[characterId]/network-nodes/[nodeId]/page.tsx`
- Create: `/home/leon/eve-frontier-scan/features/network-nodes/NetworkNodeDetailPage.tsx`
- Create: `/home/leon/eve-frontier-scan/features/network-nodes/NetworkNodeFuelFields.tsx`
- Create: `/home/leon/eve-frontier-scan/features/network-nodes/ConnectedAssembliesList.tsx`
- Create: `/home/leon/eve-frontier-scan/features/network-nodes/NetworkNodeDetailPage.test.tsx`

**Step 1: Write the failing detail test**

Assert that the page shows:

- node name or fallback name
- short object ID with Suiscan link
- solar system
- status
- raw fuel fields
- related assemblies grouped by type

**Step 2: Run the test**

Run:

```bash
bunx vitest run features/network-nodes/NetworkNodeDetailPage.test.tsx
```

Expected: FAIL.

**Step 3: Implement the page**

Requirements:

- title uses metadata name when available
- fallback uses standardized short-ID naming
- connected assemblies groups:
  - `Gate`
  - `Storage`
  - `Shipyard-like / ship-support`
  - `Other`
- all groups fully expanded
- all items fully shown
- simple list rows, not nested tables

**Step 4: Re-run the test**

Run:

```bash
bunx vitest run features/network-nodes/NetworkNodeDetailPage.test.tsx
```

Expected: PASS.

**Step 5: Commit**

```bash
git add app features lib
git commit -m "feat: add network node detail page"
```

---

### Task 9: Implement the Assemblies Index Page

**Files:**
- Create: `/home/leon/eve-frontier-scan/app/dashboard/[characterId]/assemblies/page.tsx`
- Create: `/home/leon/eve-frontier-scan/features/assemblies/AssembliesPage.tsx`
- Create: `/home/leon/eve-frontier-scan/features/assemblies/AssemblyGroupSection.tsx`
- Create: `/home/leon/eve-frontier-scan/features/assemblies/AssemblyRow.tsx`
- Create: `/home/leon/eve-frontier-scan/features/assemblies/AssembliesPage.test.tsx`

**Step 1: Write the failing assemblies page test**

Assert:

- only groups with data are shown
- group titles use type names directly
- row columns are:
  - `Status`
  - `Name`
  - `Solar System`
  - `Details`
- missing names fall back to `Type Name · 0x1234…abcd`
- known types show wiki link

**Step 2: Run the test**

Run:

```bash
bunx vitest run features/assemblies/AssembliesPage.test.tsx
```

Expected: FAIL.

**Step 3: Implement the page**

Requirements:

- technical type grouping only
- no type-specific third column yet
- `Details` required for every row
- known type link opens `https://evefrontier.wiki/`

**Step 4: Re-run the test**

Run:

```bash
bunx vitest run features/assemblies/AssembliesPage.test.tsx
```

Expected: PASS.

**Step 5: Commit**

```bash
git add app features lib
git commit -m "feat: add assemblies grouped page"
```

---

### Task 10: Implement the Generic Assembly Detail and Placeholder Pages

**Files:**
- Create: `/home/leon/eve-frontier-scan/app/dashboard/[characterId]/assemblies/[assemblyId]/page.tsx`
- Create: `/home/leon/eve-frontier-scan/app/dashboard/[characterId]/ships/page.tsx`
- Create: `/home/leon/eve-frontier-scan/app/dashboard/[characterId]/gates/page.tsx`
- Create: `/home/leon/eve-frontier-scan/features/assemblies/AssemblyDetailPage.tsx`
- Create: `/home/leon/eve-frontier-scan/features/assemblies/AssemblyDetailPage.test.tsx`

**Step 1: Write the failing assembly detail test**

Assert:

- short object ID with Suiscan link
- type with optional wiki link
- status

**Step 2: Run the test**

Run:

```bash
bunx vitest run features/assemblies/AssemblyDetailPage.test.tsx
```

Expected: FAIL.

**Step 3: Implement the generic page and placeholders**

Requirements:

- generic assembly detail only
- no per-type custom detail yet
- `Ships` and `Gates` routes exist and render simple placeholder content

**Step 4: Re-run the test**

Run:

```bash
bunx vitest run features/assemblies/AssemblyDetailPage.test.tsx
```

Expected: PASS.

**Step 5: Commit**

```bash
git add app features lib
git commit -m "feat: add generic assembly detail and placeholder sections"
```

---

### Task 11: Final Verification and Documentation Alignment

**Files:**
- Modify: `/home/leon/eve-frontier-scan/README.md`
- Modify: `/home/leon/eve-frontier-scan/docs/plans/eve-frontier-player-dashboard-proposal.md` if route or path wording needs minor correction

**Step 1: Verify core tests**

Run in `/home/leon/eve-frontier-scan`:

```bash
bun run test
```

Expected: PASS.

**Step 2: Verify lint**

Run:

```bash
bun run lint
```

Expected: PASS.

**Step 3: Verify production build**

Run:

```bash
bun run build
```

Expected: PASS.

**Step 4: Update README**

Document:

- app purpose
- route structure
- environment variables
- how lookup differs from `My dashboard`

**Step 5: Final commit**

```bash
git add README.md docs/plans/eve-frontier-player-dashboard-proposal.md
git commit -m "feat: ship nextjs wallet lookup mvp"
```
