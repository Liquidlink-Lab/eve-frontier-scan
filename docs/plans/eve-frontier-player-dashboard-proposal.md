# EVE Frontier Wallet Lookup and Character Operations Interface

## Proposal Summary

This project proposes a public-facing web tool for browsing EVE Frontier on-chain game objects by SUI address, with optional EVE Vault connection for personal dashboard access.

The original proposal positioned the product as a player-language dashboard focused on onboarding, explanation, and general account comprehension. That direction was too broad relative to what the project has already validated technically. The strongest confirmed capabilities are:

- resolving wallet-linked EVE Frontier player records
- resolving character-linked on-chain objects
- resolving Network Nodes and their connected assemblies

The revised product should therefore focus on what is already real and useful: a clean operational interface for inspecting wallet-linked game objects and their current status.

This is not a general "learn the game" dashboard. It is a lookup-first operations interface.

## Why The Proposal Is Being Revised

Two parts of the project are now clearly validated:

1. A SUI wallet address can be used to resolve EVE Frontier-linked player objects.
2. Network Nodes and their connected assemblies can be derived from the ownership chain.

The weaker part of the previous direction was product framing. The UI/UX language drifted toward a generic dashboard, and the usage logic was not strict enough. The previous proposal mixed too many jobs together:

- onboarding tool
- terminology explainer
- multi-module dashboard
- infrastructure monitor

That made the product harder to design well.

The revised proposal reduces the product to one clear job:

When a player or viewer enters a wallet address, they want to quickly inspect which EVE Frontier objects are associated with that wallet or selected character, and understand their operating state without using a block explorer directly.

## Product Positioning

### Core Position

Public lookup tool first. Personal dashboard second.

The product should primarily behave like a clean, structured EVE Frontier object browser for wallet-linked game infrastructure. Personal wallet connection remains important, but it is no longer the main identity of the product.

### Product Thesis

Build the best external interface for inspecting EVE Frontier wallet-linked operational objects.

### Primary Value

After entering a SUI address or connecting EVE Vault, a user should be able to:

- identify the related character or characters
- enter the selected character context
- inspect Network Nodes first
- inspect assemblies second
- drill into object details only when needed

## Jobs To Be Done

### Primary Job

When I inspect a SUI address or my own connected wallet, I want to see the EVE Frontier objects tied to that character and their operating state, so I can understand what exists and what needs attention without manually piecing it together from explorers.

### Secondary Job

When I want to show the tool to another player, I want to paste an address and get to meaningful game objects quickly, so the product works both as a personal interface and as a shareable lookup tool.

## Target Users

### Primary User

Players or community members who want to inspect wallet-linked EVE Frontier objects through a clearer interface than raw explorer data.

### Secondary User

Connected players who want a quick path into their own character-specific operational view.

## Product Scope

### In Scope For V1

- public SUI address lookup
- optional EVE Vault connection
- character selection when multiple characters are found
- Network Nodes list page
- Network Node detail page
- Assemblies grouped page
- generic Assembly detail page
- sidebar shell for character-specific browsing

### Out Of Scope For V1

- onboarding / teaching content
- lore, glossary, or standalone explanation pages
- marketing-style landing content
- advanced search or filtering
- tribe-level operations
- action flows such as refueling, activation, or inventory-aware transactions
- deep per-type assembly detail panels
- complete Ships and Gates implementations

## Platform And Tech Direction

### Platform

External web application

### Technical Direction

The product should be rewritten in:

- Next.js
- MUI

The design goal is not to create a flashy product site. It is to build a structured application shell with strong information density and predictable navigation.

## Entry Model

### Primary Entry

The homepage should primarily support address lookup.

Homepage structure:

1. Top: logo only
2. Center:
   - SUI address input
   - Connect EVE Vault

No explanatory sections, no glossary, no sample addresses, and no marketing copy are required in the homepage.

### Entry Priority

The address input is the primary CTA.

`Connect EVE Vault` is still present, but it is secondary to address lookup on the landing page.

## Access Modes

The product supports two modes:

### 1. Wallet Lookup Mode

The user enters a SUI address and the system attempts to resolve EVE Frontier player-linked data.

### 2. My Dashboard Mode

The user connects EVE Vault, then opens their own character-specific dashboard through the connected wallet.

These two modes should not overwrite each other automatically.

If the user is currently viewing a public wallet lookup result and then connects EVE Vault:

- the current lookup result stays on screen
- the wallet simply becomes connected
- the top-right wallet control becomes available

## Connected Wallet Control

When the wallet is connected, the main application shell should show a wallet status button at the top right.

That control should:

- display the connected short address
- open a dropdown menu

Dropdown items:

- `My dashboard`
- `Disconnect`

`My dashboard` should resolve the connected wallet using the same character routing rules as address lookup.

## Character Routing Rules

Both address lookup and `My dashboard` should use the same resolution logic:

- if zero characters are found:
  - show an empty state
- if one character is found:
  - skip character selection
  - go directly to that character's `Network Nodes` page
- if multiple characters are found:
  - show the character selection page

## Empty State

If no EVE Frontier player record can be resolved for an address, the product should show a soft but explicit empty state:

`No EVE Frontier player record found for this address.`

Supporting copy:

`This address may not hold a player NFT, or no character-linked objects could be resolved from current data.`

The page should also include:

- `Try another address`

## Character Selection Page

The character selection page should use cards, not a dropdown-only selector.

Each character card should show:

- character name
- tribe
- wallet relationship / address linkage
- owned Network Node count
- current ship

This page is only shown when multiple characters are present.

## Dashboard Shell

The sidebar should only appear after a character has been selected or resolved.

There is no sidebar on:

- homepage
- empty state page
- character selection page

### Sidebar Layout

Top section:

- source label
  - for example: `Wallet lookup` or `My dashboard`
- short wallet address
- external link to Suiscan
- character switcher

Navigation items:

- `Network Nodes`
- `Assemblies`
- `Ships`
- `Gates`

The character switcher should be a simple dropdown.

## Design Language

The UI should use a `wiki-like dark information interface`.

It should resemble a dark information site or structured internal tool, not:

- a sci-fi cockpit
- a glossy SaaS dashboard
- a card-heavy landing experience

### Design Principles

- dark theme
- fixed sidebar once inside a character
- compact, readable information density
- list and table views for upper-level pages
- dedicated detail pages for lower-level objects
- minimal decoration
- no invented lore copy
- no speculative operational language

The reference feeling is closer to a game wiki or structured tool than to a conventional startup dashboard.

## Information Architecture

### Root Flow

1. Homepage
2. Address lookup or wallet connection
3. Character resolution
4. Character selection if needed
5. Character-specific application shell
6. `Network Nodes` as default first page

There is no separate `Home` page after a character is selected.

## Network Nodes Page

This is the default first page for a selected character.

### Format

Table list page

### No V1 Toolbar Features

V1 should not include:

- search
- filters

The list should rely on sorting and scanning only.

### Default Sort Order

1. connected assemblies count
2. lowest remaining fuel

### Table Columns

1. `Status`
2. `Name`
3. `Solar System`
4. `Fuel`
5. `Connected Assemblies`
6. `Details`

### Row Content

Each row should let the user quickly determine:

- whether the node is online or offline
- where it is, if system metadata exists
- how much fuel remains
- how many connected assemblies exist

## Network Node Detail Page

The detail page should use a dedicated page, not a modal or drawer.

### Header Identity

The page title should use:

- object metadata name if available
- otherwise a standardized fallback name

Object ID should appear as:

- short object ID
- small external link to Suiscan

### First-Screen Content

The first screen should show:

- solar system
- status
- raw fuel information

Fuel should not be over-summarized in V1. If the object format is complex, the interface should simply surface the raw fields clearly.

### Related Assemblies Section

Below the primary information, the page should list assemblies connected to the node.

This list should:

- be grouped by type
- show all items
- not collapse by default

Initial groups:

- `Gate`
- `Storage`
- `Shipyard-like / ship-support group`
- `Other`

These names can be refined later once the exact object type mapping is stabilized.

Each assembly item in the detail page should be a simple list row, not a nested table.

## Assemblies Page

The `Assemblies` page should not duplicate the Network Node relationship view.

It should instead provide a type-grouped index of assemblies related to the currently selected character.

### Grouping

Group by technical type, not by purpose.

Only groups that contain data should be shown.

Groups should be expanded by default.

### Assembly Row Columns

1. `Status`
2. `Name`
3. `Solar System`
4. `Details`

### Name Fallback Rule

Most assemblies may not have stable human-readable names.

When no name exists, the UI should use:

`Type Name · 0x1234…abcd`

### Type Links

Every assembly type label should support an external link to `https://evefrontier.wiki/` when a known mapping exists.

V1 approach:

- maintain a manual mapping for known types
- if no known mapping exists, do not show the wiki link

## Assembly Detail Page

Each assembly type should eventually have its own richer component, but V1 should start with a generic detail page.

### V1 Detail Fields

- object ID
- type
- status

Object ID display:

- short form
- external link to Suiscan

Type display:

- include external wiki link when a mapping exists

The generic page should be designed to allow future per-type expansion without needing to redesign the entire route structure.

## Ships And Gates

Both should exist in the sidebar in V1, but they are placeholders only.

The proposal should not overstate their first release scope.

### V1 Expectation

- page exists
- navigation works
- content may be placeholder or minimal

## Data Model Assumptions

The current discovery path is:

`wallet address -> PlayerProfile -> character_id -> character-owned owner caps -> authorized world objects`

This means the project should be designed around character-scoped browsing after resolution, not direct wallet-wide object dumping inside the main shell.

It is also important to note that a wallet may resolve to:

- zero characters
- one character
- multiple characters

The current reference model does not enforce one wallet equals one character.

## Confirmed Product Strengths

The revised proposal should explicitly lean on the product's strongest validated technical capabilities:

- resolving wallet-linked EVE Frontier objects
- resolving character-linked structures
- resolving Network Nodes
- resolving connected assemblies

These capabilities are concrete and should define the first version of the product.

## What V1 Should Not Pretend To Be

The product should not describe itself as:

- a complete game dashboard
- an educational wiki replacement
- a route planner
- a strategic recommendation engine
- a fully operational control surface

Those directions can exist later, but they should not shape the first serious product rewrite.

## Success Criteria

V1 succeeds if a user can:

1. enter a SUI address or connect EVE Vault
2. resolve into zero, one, or many characters predictably
3. enter a character context
4. inspect Network Nodes quickly in a table-first interface
5. inspect assemblies in grouped form
6. drill into object details with clean external links to Suiscan and, where mapped, EVE Frontier Wiki

## Summary

The revised proposal is a stricter and more honest product:

- lookup-first, not explanation-first
- object operations interface, not generic dashboard
- wiki-like dark information design, not product-marketing UI
- character-scoped browsing after resolution
- Network Nodes first, Assemblies second
- minimal but extensible detail pages

This proposal is better aligned with both the validated data pipeline and the actual product shape the project can execute well.
