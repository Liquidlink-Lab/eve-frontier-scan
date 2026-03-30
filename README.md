# EVE Frontier Scan

EVE Frontier Scan is a web interface for inspecting wallet-linked activity and infrastructure in EVE Frontier on Sui.

It is designed as a fast operational entry point:

- Look up any public Sui wallet and resolve the linked EVE Frontier characters.
- Open a character-scoped dashboard for network nodes, assemblies, ships, and gates.
- Connect EVE Vault and jump into your own dashboard flow without losing the current public lookup context.

## Entry Modes

### Wallet lookup

Paste a Sui address to inspect the characters and structures linked to that wallet.

### My dashboard

Connect EVE Vault to resolve your own characters and enter the dashboard flow directly.

## What the App Focuses On

- Wallet lookup
- Character dashboard
- Structure tracing

## Development

### Stack

- Next.js App Router
- React 19
- TypeScript
- MUI
- TanStack Query
- Vitest + Testing Library

### Setup

1. Install dependencies:

```bash
bun install
```

2. Copy the sample environment file into your local environment as needed:

```bash
cp .envsample .env.local
```

3. Start the app:

```bash
bun dev
```

### Environment Variables

Defined in [`.envsample`](/home/leon/eve-frontier-scan/.envsample):

- `NEXT_PUBLIC_WORLD_API_URL`
- `NEXT_PUBLIC_EVE_WORLD_PACKAGE_ID`
- `NEXT_PUBLIC_SUI_GRAPHQL_ENDPOINT`

### Routes

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

### Lookup Flow

Both wallet lookup and `My dashboard` use the same routing rules:

- `0` characters: render the empty state
- `1` character: redirect directly to the default dashboard view
- `>1` characters: render the character selection page

The dashboard sidebar only appears inside `/dashboard/[characterId]/*`.

### Commands

```bash
bun run test
bun run lint
bun run build
```
