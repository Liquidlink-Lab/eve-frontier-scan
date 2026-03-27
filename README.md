# EVE Frontier Scan

Public wallet lookup and character-scoped operations interface for EVE Frontier on Sui.

The app supports two entry modes:

- `Wallet lookup`: paste a Sui address and inspect the linked EVE Frontier characters and structures.
- `My dashboard`: connect EVE Vault, then resolve your own linked characters without replacing any public lookup page you are already viewing.

## Stack

- Next.js App Router
- React 19
- TypeScript
- MUI
- TanStack Query
- Vitest + Testing Library

## Setup

1. Install dependencies:

```bash
bun install
```

2. Copy the sample environment file values into your local environment as needed:

```bash
cp .envsample .env.local
```

3. Start the app:

```bash
bun dev
```

## Environment Variables

Defined in [.envsample](/home/astu9702/projects/eve-frontier-scan/.envsample):

- `NEXT_PUBLIC_WORLD_API_URL`
- `NEXT_PUBLIC_EVE_WORLD_PACKAGE_ID`
- `NEXT_PUBLIC_SUI_GRAPHQL_ENDPOINT`

## Routes

Public entry routes:

- `/`
- `/lookup/[address]`
- `/lookup/[address]/characters`
- `/me`

Character dashboard routes:

- `/dashboard/[characterId]/network-nodes`
- `/dashboard/[characterId]/network-nodes/[nodeId]`
- `/dashboard/[characterId]/assemblies`
- `/dashboard/[characterId]/assemblies/[assemblyId]`
- `/dashboard/[characterId]/ships`
- `/dashboard/[characterId]/gates`

Dashboard routes require wallet access context in the query string:

- `wallet=<normalized-sui-address>`
- `source=sui-address | eve-vault`

## Lookup Flow

Both wallet lookup and `My dashboard` use the same routing rules:

- `0` characters: render the empty state
- `1` character: redirect directly to `Network Nodes`
- `>1` characters: render the character selection page

The dashboard sidebar only appears inside `/dashboard/[characterId]/*`.

## Commands

```bash
bun run test
bun run lint
bun run build
```
