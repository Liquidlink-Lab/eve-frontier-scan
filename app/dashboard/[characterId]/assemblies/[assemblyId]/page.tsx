import type { Metadata } from "next";
import { Box, Paper, Stack, Typography } from "@mui/material";

import AssemblyDetailPage from "@/features/assemblies/AssemblyDetailPage";
import { normalizeSuiAddress } from "@/lib/eve/address";
import { discoverStorageInventory } from "@/lib/eve/discovery/storageInventoryDiscovery";
import {
  mapDiscoveryToAssemblyDetail,
} from "@/lib/eve/discovery/eveOwnershipMappers";
import {
  createOwnershipGraphQlClient,
  fetchWalletStructureDiscovery,
} from "@/lib/eve/discovery/eveOwnershipClient";
import { createLabelLookupsWithWorldTypes } from "@/lib/eve/lookups";
import type { WalletSource } from "@/lib/eve/types";
import { getWorldTypeLookup } from "@/lib/eve/worldTypes";

const dashboardLabelLookups = createLabelLookupsWithWorldTypes(getWorldTypeLookup());

export const metadata: Metadata = {
  title: "Assembly Detail",
  description: "Generic assembly detail view for EVE Frontier.",
};

interface DashboardAssemblyDetailPageProps {
  params: Promise<{
    characterId: string;
    assemblyId: string;
  }>;
  searchParams: Promise<{
    wallet?: string;
    source?: string;
  }>;
}

export default async function DashboardAssemblyDetailPage({
  params,
  searchParams,
}: DashboardAssemblyDetailPageProps) {
  const { characterId, assemblyId } = await params;
  const { wallet, source } = await searchParams;
  const normalizedWalletAddress = normalizeSuiAddress(wallet ?? "");
  const accessSource = isWalletSource(source) ? source : null;

  if (!normalizedWalletAddress || accessSource === null) {
    return (
      <DashboardInfoState
        title="Assembly"
        message="This assembly link is missing wallet context. Re-open it from a wallet lookup or from My dashboard."
      />
    );
  }

  const discovery = await fetchWalletStructureDiscovery(normalizedWalletAddress);
  const character = discovery.characters.find((entry) => entry.characterId === characterId);
  const assemblyStructure = character
    ? [...character.ownedStructures, ...(character.relatedStructures ?? [])].find(
        (entry) => entry.id === assemblyId,
      ) ?? null
    : null;
  const assembly = mapDiscoveryToAssemblyDetail(
    discovery,
    characterId,
    assemblyId,
    dashboardLabelLookups,
  );

  if (!assembly) {
    return (
      <DashboardInfoState
        title="Assembly"
        message="The requested assembly could not be resolved for this character."
      />
    );
  }

  const storageInventory = await discoverStorageInventory({
    assembly: assemblyStructure,
    graphQl: createOwnershipGraphQlClient(),
    worldTypes: getWorldTypeLookup(),
  });

  return (
    <AssemblyDetailPage
      characterName={character?.character?.name ?? "Unknown character"}
      assembly={assembly}
      storageInventory={storageInventory}
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
