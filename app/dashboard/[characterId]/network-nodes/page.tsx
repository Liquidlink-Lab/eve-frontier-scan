import type { Metadata } from "next";
import { Box, Paper, Stack, Typography } from "@mui/material";

import { formatShortAddress, normalizeSuiAddress } from "@/lib/eve/address";
import { parseEveWorld } from "@/lib/eve/env";
import {
  mapDiscoveryToNetworkNodes,
} from "@/lib/eve/discovery/eveOwnershipMappers";
import { fetchWalletStructureDiscovery } from "@/lib/eve/discovery/eveOwnershipClient";
import NetworkNodesPage from "@/features/network-nodes/NetworkNodesPage";
import { createLabelLookupsWithWorldTypes } from "@/lib/eve/lookups";
import type { WalletSource } from "@/lib/eve/types";
import { getWorldTypeLookup } from "@/lib/eve/worldTypes";

const dashboardLabelLookups = createLabelLookupsWithWorldTypes(getWorldTypeLookup());

export const metadata: Metadata = {
  title: "Network Nodes",
  description: "Character-scoped network node dashboard for EVE Frontier.",
};

interface DashboardNetworkNodesPageProps {
  params: Promise<{
    characterId: string;
  }>;
  searchParams: Promise<{
    wallet?: string;
    source?: string;
    world?: string;
  }>;
}

export default async function DashboardNetworkNodesPage({
  params,
  searchParams,
}: DashboardNetworkNodesPageProps) {
  const { characterId } = await params;
  const { wallet, source, world } = await searchParams;
  const eveWorld = parseEveWorld(world);
  const normalizedWalletAddress = normalizeSuiAddress(wallet ?? "");
  const accessSource = isWalletSource(source) ? source : null;

  if (!normalizedWalletAddress || accessSource === null) {
    return (
      <Box component="main" sx={{ flex: 1, px: 3, py: { xs: 4, md: 6 } }}>
        <Paper elevation={0} sx={{ maxWidth: 960, mx: "auto", px: 4, py: 5 }}>
          <Stack spacing={1.5}>
            <Typography variant="h3">Network Nodes</Typography>
            <Typography color="text.secondary">
              This dashboard link is missing wallet context. Re-open it from a
              wallet lookup or from My dashboard.
            </Typography>
          </Stack>
        </Paper>
      </Box>
    );
  }

  const discovery = await fetchWalletStructureDiscovery(
    normalizedWalletAddress,
    eveWorld,
  );
  const character = discovery.characters.find((entry) => entry.characterId === characterId);
  const networkNodes = mapDiscoveryToNetworkNodes(
    discovery,
    characterId,
    dashboardLabelLookups,
  );

  return (
    <NetworkNodesPage
      access={{
        walletAddress: normalizedWalletAddress,
        source: accessSource,
        world: eveWorld,
      }}
      characterId={characterId}
      characterName={
        character?.character?.name
          ? `${character.character.name} · ${formatShortAddress(normalizedWalletAddress)}`
          : `Unknown character · ${formatShortAddress(normalizedWalletAddress)}`
      }
      networkNodes={networkNodes}
    />
  );
}

function isWalletSource(value: string | undefined): value is WalletSource {
  return value === "eve-vault" || value === "sui-address";
}
