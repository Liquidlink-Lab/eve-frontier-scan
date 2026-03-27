import type { Metadata } from "next";
import { Box, Paper, Stack, Typography } from "@mui/material";

import AssembliesPage from "@/features/assemblies/AssembliesPage";
import { normalizeSuiAddress } from "@/lib/eve/address";
import { mapDiscoveryToAssembliesByType } from "@/lib/eve/discovery/eveOwnershipMappers";
import { fetchWalletStructureDiscovery } from "@/lib/eve/discovery/eveOwnershipClient";
import { eveLabelLookups } from "@/lib/eve/lookups";
import type { WalletSource } from "@/lib/eve/types";

export const metadata: Metadata = {
  title: "Assemblies",
  description: "Character-scoped assembly index for EVE Frontier.",
};

interface DashboardAssembliesPageProps {
  params: Promise<{
    characterId: string;
  }>;
  searchParams: Promise<{
    wallet?: string;
    source?: string;
  }>;
}

export default async function DashboardAssembliesPage({
  params,
  searchParams,
}: DashboardAssembliesPageProps) {
  const { characterId } = await params;
  const { wallet, source } = await searchParams;
  const normalizedWalletAddress = normalizeSuiAddress(wallet ?? "");
  const accessSource = isWalletSource(source) ? source : null;

  if (!normalizedWalletAddress || accessSource === null) {
    return (
      <DashboardInfoState
        title="Assemblies"
        message="This assemblies link is missing wallet context. Re-open it from a wallet lookup or from My dashboard."
      />
    );
  }

  const discovery = await fetchWalletStructureDiscovery(normalizedWalletAddress);
  const character = discovery.characters.find((entry) => entry.characterId === characterId);
  const groups = mapDiscoveryToAssembliesByType(discovery, characterId, eveLabelLookups);

  return (
    <AssembliesPage
      access={{
        walletAddress: normalizedWalletAddress,
        source: accessSource,
      }}
      characterId={characterId}
      characterName={character?.character?.name ?? "Unknown character"}
      groups={groups}
    />
  );
}

function DashboardInfoState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <Box component="main" sx={{ flex: 1, px: 3, py: { xs: 4, md: 6 } }}>
      <Paper elevation={0} sx={{ maxWidth: 960, mx: "auto", px: 4, py: 5 }}>
        <Stack spacing={1.5}>
          <Typography variant="h3">{title}</Typography>
          <Typography color="text.secondary">{message}</Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

function isWalletSource(value: string | undefined): value is WalletSource {
  return value === "eve-vault" || value === "sui-address";
}
