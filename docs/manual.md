# How to Use EVE Frontier Scan to Inspect Wallet-Linked Characters and Structures

*A simple guide to looking up SUI wallets, resolving EVE Frontier characters, and moving into a clean character-scoped dashboard.*

If you play EVE Frontier and have ever tried to trace activity from a wallet to the characters and structures linked to it, you already know the problem: the information exists, but the flow is rarely convenient.

You start with a SUI wallet address, then you try to work out which characters are linked to it, and then you still need to make sense of the structures behind that context. It is possible, but it is not especially readable.

That is where EVE Frontier Scan comes in.

EVE Frontier Scan is a lightweight web tool designed to make that lookup flow much easier. Instead of treating wallet addresses, characters, and structures as separate steps you have to manually stitch together, it gives you a single entry point and a character-scoped dashboard.

In practice, that means you can start from a public wallet, resolve the linked characters, and move directly into views for things like network nodes and assemblies.

[Insert screenshot: homepage]

## What EVE Frontier Scan is for

The easiest way to think about EVE Frontier Scan is this:

It is an operational lookup tool for EVE Frontier on Sui.

It is not trying to be a huge analytics platform or a dense explorer replacement. Its strength is that it gives you a clean way to move from a wallet to the relevant in-game context.

Right now, the most useful parts of the app are:

- wallet lookup
- character selection
- network node inspection
- assembly tracing

So if your goal is to understand what sits behind a wallet-linked identity in EVE Frontier, this tool gives you a much more readable path.

## Two ways to enter the app

EVE Frontier Scan keeps the entry flow intentionally simple. There are only two main ways in:

### 1. Look up any public SUI wallet

If you want to inspect a public address, paste a SUI wallet into the homepage lookup field.

From there, the app resolves the EVE Frontier characters linked to that wallet and routes you based on the result:

- If no characters are found, you get a clear empty state
- If exactly one character is found, you are taken directly to that character's dashboard
- If multiple characters are found, you can choose which one to inspect

This is the best option when you are investigating a public wallet or reviewing another player's linked structure context.

[Insert screenshot: wallet lookup result]

### 2. Connect EVE Vault

If you want to inspect your own setup, the faster path is to connect EVE Vault from the homepage.

Once connected, the app resolves your wallet context and sends you into the same dashboard flow without needing to paste an address manually. This makes it the most convenient option for routine personal use.

If you are checking your own structures often, this is probably the mode you will use most.

[Insert screenshot: connected wallet state]

## What happens after lookup

Once a wallet is resolved, EVE Frontier Scan shifts from being a search tool into a dashboard.

That dashboard is character-scoped, which matters because it keeps the information tied to a clear identity rather than leaving you in a loose wallet-only view. If a wallet is linked to more than one character, you choose the relevant one first and then continue from there.

This makes the experience much easier to follow. Instead of repeatedly asking, "Which character am I looking at now?" the app keeps that context visible as you move through the dashboard.

## The most useful dashboard views today

The strongest part of the current product is the Network Nodes flow.

From the dashboard, you can open a structured list of network nodes associated with the selected character and then drill into node details. That gives you a much cleaner inspection flow than piecing everything together by hand.

Assemblies are also part of the current experience, which makes it possible to trace additional infrastructure linked to the same wallet context.

The dashboard already includes room for ships and gates as part of the broader direction of the tool, but today the most complete and useful flows are network nodes and assemblies. That is worth knowing before you jump in, especially if you are writing about the tool for new users.

[Insert screenshot: network nodes table]

[Insert screenshot: network node detail or assemblies page]

## Why this tool is useful

What EVE Frontier Scan does well is not that it invents new data. Its value is that it makes existing wallet-linked information easier to inspect.

That sounds simple, but it matters.

Without a tool like this, you often end up bouncing between raw wallet context, partial identity resolution, and separate structure views. The information is technically there, but the experience is fragmented.

EVE Frontier Scan reduces that friction by keeping the journey connected:

one wallet entry point, one character selection flow, and one dashboard context.

That is what makes it practical.

## Final thoughts

If you want the shortest possible summary, it is this:

Use wallet lookup when you want to inspect a public SUI address. Use EVE Vault when you want to jump directly into your own dashboard.

That is the core experience of EVE Frontier Scan, and it is already enough to make the tool genuinely useful for EVE Frontier players who care about wallet-linked character and structure visibility.

If you are exploring operational context in EVE Frontier and want a cleaner path from wallet to dashboard, this is a good place to start.
