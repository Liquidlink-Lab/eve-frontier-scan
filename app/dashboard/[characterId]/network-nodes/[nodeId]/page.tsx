import type { Metadata } from "next";
import { Box, Paper, Stack, Typography } from "@mui/material";

import { normalizeSuiAddress } from "@/lib/eve/address";
import { mapDiscoveryToNetworkNodeDetail } from "@/lib/eve/discovery/eveOwnershipMappers";
import { fetchWalletStructureDiscovery } from "@/lib/eve/discovery/eveOwnershipClient";
import { eveLabelLookups } from "@/lib/eve/lookups";
import type { WalletSource } from "@/lib/eve/types";
import NetworkNodeDetailPage from "@/features/network-nodes/NetworkNodeDetailPage";

export const metadata: Metadata = {
  title: "Network Node Detail",
  description: "Detailed network node view for EVE Frontier.",
};

interface DashboardNetworkNodeDetailPageProps {
  params: Promise<{
    characterId: string;
    nodeId: string;
  }>;
  searchParams: Promise<{
    wallet?: string;
    source?: string;
  }>;
}

export default async function DashboardNetworkNodeDetailPage({
  params,
  searchParams,
}: DashboardNetworkNodeDetailPageProps) {
  const { characterId, nodeId } = await params;
  const { wallet, source } = await searchParams;
  const normalizedWalletAddress = normalizeSuiAddress(wallet ?? "");
  const accessSource = isWalletSource(source) ? source : null;

  if (!normalizedWalletAddress || accessSource === null) {
    return (
      <MissingContextState message="This network node link is missing wallet context. Re-open it from a wallet lookup or from My dashboard." />
    );
  }

  const discovery = await fetchWalletStructureDiscovery(normalizedWalletAddress);
  const character = discovery.characters.find((entry) => entry.characterId === characterId);
  const networkNode = mapDiscoveryToNetworkNodeDetail(
    discovery,
    characterId,
    nodeId,
    eveLabelLookups,
  );

  if (!networkNode) {
    return <MissingContextState message="The requested network node could not be resolved for this character." />;
  }

  return (
    <NetworkNodeDetailPage
      access={{
        walletAddress: normalizedWalletAddress,
        source: accessSource,
      }}
      characterId={characterId}
      characterName={character?.character?.name ?? "Unknown character"}
      networkNode={networkNode}
    />
  );
}

function MissingContextState({ message }: { message: string }) {
  return (
    <Box component="main" sx={{ flex: 1, px: 3, py: { xs: 4, md: 6 } }}>
      <Paper elevation={0} sx={{ maxWidth: 960, mx: "auto", px: 4, py: 5 }}>
        <Stack spacing={1.5}>
          <Typography variant="h3">Network Node</Typography>
          <Typography color="text.secondary">{message}</Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

function isWalletSource(value: string | undefined): value is WalletSource {
  return value === "eve-vault" || value === "sui-address";
}
