import type { Metadata } from "next";
import { Box, Paper, Stack, Typography } from "@mui/material";

import AssemblyDetailPage from "@/features/assemblies/AssemblyDetailPage";
import { normalizeSuiAddress } from "@/lib/eve/address";
import { eveEnv } from "@/lib/eve/env";
import { discoverCharacterSummaries } from "@/lib/eve/discovery/characterSummaryDiscovery";
import { discoverGateActivity } from "@/lib/eve/discovery/gateActivityDiscovery";
import {
  discoverAssemblyExtensionFrozenStatus,
  discoverGateConfig,
} from "@/lib/eve/discovery/gateConfigDiscovery";
import { createSuiJsonRpcClient } from "@/lib/eve/discovery/suiRpcClient";
import { discoverStorageInventory } from "@/lib/eve/discovery/storageInventoryDiscovery";
import { discoverTurretActivity } from "@/lib/eve/discovery/turretActivityDiscovery";
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

  const graphQl = createOwnershipGraphQlClient();
  const rpc = createSuiJsonRpcClient();
  const structureNamesById = character
    ? new Map(
        [...character.ownedStructures, ...(character.relatedStructures ?? [])].map((entry) => [
          entry.id,
          entry.name,
        ]),
      )
    : new Map<string, string>();
  const storageInventory = await discoverStorageInventory({
    assembly: assemblyStructure,
    graphQl,
    worldTypes: getWorldTypeLookup(),
  });
  const isGateAssembly = assembly.typeRepr.includes("::gate::Gate");
  const isTurretAssembly = assembly.typeRepr.includes("::turret::Turret");
  const gateConfig = isGateAssembly
    ? await discoverGateConfig({
        gateTypeId: assembly.typeId,
        graphQl,
        packageId: eveEnv.eveWorldPackageId,
        rpc,
      })
    : { maxLinkDistance: null };
  const gateActivity = isGateAssembly
    ? await discoverGateActivity({
        gateId: assembly.id,
        packageId: eveEnv.eveWorldPackageId,
        rpc,
      })
    : {
        recentJumps: [],
        recentPermits: [],
      };
  const gateActivityCharacterSummaries = isGateAssembly
    ? await discoverCharacterSummaries({
        characterIds: [
          ...gateActivity.recentJumps.map((jump) => jump.characterId),
          ...gateActivity.recentPermits.map((permit) => permit.characterId),
        ].filter((value): value is string => Boolean(value)),
        rpc,
      })
    : new Map();
  const turretActivity = isTurretAssembly
    ? await discoverTurretActivity({
        turretId: assembly.id,
        packageId: eveEnv.eveWorldPackageId,
        rpc,
      })
    : null;
  const extensionFrozen = isGateAssembly || isTurretAssembly
    ? await discoverAssemblyExtensionFrozenStatus({
        assemblyId: assembly.id,
        packageId: eveEnv.eveWorldPackageId,
        rpc,
      })
    : assembly.extensionFrozen;
  const assemblyDetail = {
    ...assembly,
    extensionFrozen,
    gateMaxLinkDistance: gateConfig.maxLinkDistance,
    recentJumps: gateActivity.recentJumps.map((jump) => ({
      ...jump,
      sourceGateName: structureNamesById.get(jump.sourceGateId) ?? null,
      destinationGateName: structureNamesById.get(jump.destinationGateId) ?? null,
      characterName: jump.characterId
        ? gateActivityCharacterSummaries.get(jump.characterId)?.name ?? null
        : null,
      characterWalletAddress: jump.characterId
        ? gateActivityCharacterSummaries.get(jump.characterId)?.walletAddress ?? null
        : null,
    })),
    recentPermits: gateActivity.recentPermits.map((permit) => ({
      ...permit,
      sourceGateName: structureNamesById.get(permit.sourceGateId) ?? null,
      destinationGateName: structureNamesById.get(permit.destinationGateId) ?? null,
      characterName: permit.characterId
        ? gateActivityCharacterSummaries.get(permit.characterId)?.name ?? null
        : null,
      characterWalletAddress: permit.characterId
        ? gateActivityCharacterSummaries.get(permit.characterId)?.walletAddress ?? null
        : null,
    })),
    latestTurretPrioritySnapshot: turretActivity,
  };

  return (
    <AssemblyDetailPage
      access={{
        walletAddress: normalizedWalletAddress,
        source: accessSource,
      }}
      characterId={characterId}
      characterName={character?.character?.name ?? "Unknown character"}
      assembly={assemblyDetail}
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
