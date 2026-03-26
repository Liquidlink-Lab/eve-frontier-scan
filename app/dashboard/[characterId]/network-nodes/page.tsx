import type { Metadata } from "next";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

import { formatShortAddress, normalizeSuiAddress } from "@/lib/eve/address";
import {
  mapDiscoveryToNetworkNodes,
} from "@/lib/eve/discovery/eveOwnershipMappers";
import { fetchWalletStructureDiscovery } from "@/lib/eve/discovery/eveOwnershipClient";
import { eveLabelLookups } from "@/lib/eve/lookups";

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
  }>;
}

export default async function DashboardNetworkNodesPage({
  params,
  searchParams,
}: DashboardNetworkNodesPageProps) {
  const { characterId } = await params;
  const { wallet } = await searchParams;
  const normalizedWalletAddress = normalizeSuiAddress(wallet ?? "");

  if (!normalizedWalletAddress) {
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

  const discovery = await fetchWalletStructureDiscovery(normalizedWalletAddress);
  const character = discovery.characters.find((entry) => entry.characterId === characterId);
  const networkNodes = mapDiscoveryToNetworkNodes(
    discovery,
    characterId,
    eveLabelLookups,
  );

  return (
    <Box component="main" sx={{ flex: 1, px: 3, py: { xs: 4, md: 6 } }}>
      <Stack spacing={3} sx={{ maxWidth: 960, mx: "auto" }}>
        <div>
          <Typography variant="h3">Network Nodes</Typography>
          <Typography color="text.secondary">
            {character?.character?.name ?? "Unknown character"} ·{" "}
            {formatShortAddress(normalizedWalletAddress)}
          </Typography>
        </div>

        {networkNodes.length === 0 ? (
          <Paper elevation={0} sx={{ px: 4, py: 5 }}>
            <Typography color="text.secondary">
              No network nodes were found for this character.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {networkNodes.map((networkNode) => (
              <Paper key={networkNode.id} elevation={0} sx={{ px: 3, py: 2.5 }}>
                <Stack spacing={1.5}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <div>
                      <Typography variant="h5">{networkNode.name}</Typography>
                      <Typography color="text.secondary">
                        {networkNode.connectedAssemblyCount} connected assemblies
                      </Typography>
                    </div>
                    <Chip
                      label={networkNode.status}
                      color={networkNode.status === "online" ? "success" : "default"}
                      variant="outlined"
                    />
                  </Stack>
                  <Typography color="text.secondary">
                    Fuel:{" "}
                    {networkNode.fuelPercent === null
                      ? "Unavailable"
                      : `${networkNode.fuelPercent}%`}
                  </Typography>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
