# How to Use EVE Frontier Scan to Go from Wallet to Character Dashboard

*EVE Frontier Scan is a fast way to move from a SUI wallet to the characters, network nodes, and assemblies tied to that wallet.*

The value is simple: start from a public SUI wallet or your own EVE Vault session, resolve the linked pilots, and move through a character-scoped dashboard. The tool does not create new data. It makes existing ownership and structure data much easier to read.

[Insert screenshot: homepage]

## Start with one of two entry points

### 1. Paste a public SUI wallet

If you want to inspect another player's public wallet, paste the address into the homepage lookup field.

After that, the app resolves the EVE Frontier characters linked to the wallet and routes you based on what it finds:

- no linked character: you see a clear empty state
- one linked character: you go straight into that character's dashboard
- multiple linked characters: you land on a character selection page first

### 2. Connect EVE Vault

If you want to inspect your own account, connect EVE Vault from the homepage instead.

That skips manual address entry and sends you through the same resolution flow using your connected wallet context.

[Insert screenshot: connected wallet state]

## What you can see on each page

### Homepage

The homepage gives you:

- a wallet input for any public SUI address
- a Connect EVE Vault button for your own account
- a quick summary of the supported workflows: wallet lookup, character dashboard, and structure tracing

### Character selection page

If one wallet resolves to multiple pilots, you will land on a character selection page before entering the dashboard.

Each card shows:

- character name
- tribe
- wallet source and shortened wallet address
- number of linked network nodes
- current ship name when available

From there, `Open dashboard` takes you into that character's Network Nodes view.

### Dashboard shell

The shared dashboard frame includes:

- a search bar at the top for inspecting another wallet without returning home
- a sidebar that shows the wallet source and links the wallet address to SuiScan
- a character switcher when the same wallet resolves to multiple pilots
- breadcrumbs so you can always see which character and section you are viewing
- navigation for `Network Nodes` and `Assemblies`

You will also notice `Ships` and `Gates` in the navigation. Those are part of the broader product direction, but they are not full standalone MVP sections yet.

### Network Nodes page

The table shows, for each node:

- status
- node name and icon
- solar system
- fuel type
- fuel percentage and progress bar
- fuel ETA
- connected assembly count

Each row links to a detail page. Nodes with more connected assemblies rise to the top, and lower-fuel nodes are easier to spot quickly.

[Insert screenshot: network nodes table]

### Network Node detail page

On this page you can inspect:

- solar system
- coordinates
- status
- fuel type
- fuel percentage
- fuel quantity
- fuel ETA
- related assemblies grouped by structure type

Each related assembly links directly to its own detail page.

[Insert screenshot: network node detail]

### Assemblies page

Open `Assemblies` when you want a broader structure overview. Instead of one flat list, the page groups assemblies by structure type. Inside each group you can see:

- status
- structure name and icon
- solar system
- a link to the detail page

### Assembly detail page

Assembly detail pages expose the most information. Shared fields can include:

- type
- solar system
- coordinates
- status
- description
- reference URL
- upstream power source
- extension label and extension type
- extension frozen status
- linked gate
- gate access mode

The page expands further depending on the structure type:

- Gate assemblies show recent jumps and recent permits, with timestamps, route links, pilot context, and SuiScan transaction links.
- Storage units show owner inventory, open storage, player-owned inventories, capacity usage, item tables, and recent inventory activity.
- Turrets show the latest target priority snapshot, including health ratios, priority weight, behaviour change, and aggressor state.

[Insert screenshot: assembly detail]

## What is complete today

If you are learning the app quickly, focus on wallet lookup, character selection, Network Nodes, Assemblies, and the node or assembly detail pages. `Ships` and the standalone `Gates` section are still placeholders in the current MVP. Gate-specific operational data already exists, but it appears inside individual gate assembly detail pages rather than in a separate dashboard index.

## Final takeaway

Use wallet lookup when you want to inspect any public SUI address. Use EVE Vault when you want to jump into your own account faster. After that, pick a character, use Network Nodes for fast operational triage, and use Assemblies to drill into the linked infrastructure behind that character.
