"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import CharacterSelectionPage, {
  resolveCharacterLookupState,
} from "@/features/characters/CharacterSelectionPage";
import LookupEmptyState from "@/features/lookup/LookupEmptyState";
import { fetchWalletStructureDiscovery } from "@/lib/eve/discovery/eveOwnershipClient";
import type { EveWorld } from "@/lib/eve/env";
import { eveLabelLookups } from "@/lib/eve/lookups";
import { useWalletSession } from "@/features/wallet/useWalletSession";

interface MyDashboardEntryPageProps {
  world: EveWorld;
}

export default function MyDashboardEntryPage({
  world,
}: MyDashboardEntryPageProps) {
  const router = useRouter();
  const walletSession = useWalletSession();
  const discoveryQuery = useQuery({
    queryKey: ["wallet-structure-discovery", walletSession.walletAddress, world],
    queryFn: () => fetchWalletStructureDiscovery(walletSession.walletAddress!, world),
    enabled: walletSession.isConnected && Boolean(walletSession.walletAddress),
  });

  const state =
    walletSession.walletAddress && discoveryQuery.data
      ? resolveCharacterLookupState(
          discoveryQuery.data,
          {
            source: "eve-vault",
            walletAddress: walletSession.walletAddress,
            world,
          },
          eveLabelLookups,
        )
      : null;

  useEffect(() => {
    if (state?.kind === "single") {
      router.replace(state.redirectTo);
    }
  }, [router, state]);

  if (!walletSession.isConnected || !walletSession.walletAddress) {
    return (
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "grid",
          placeItems: "center",
          px: 3,
          py: 8,
        }}
      >
        <Paper elevation={0} sx={{ maxWidth: 560, px: 4, py: 5 }}>
          <Stack spacing={1.5}>
            <Typography variant="h4">My dashboard</Typography>
            <Typography color="text.secondary">
              Connect EVE Vault from the top-right wallet control to resolve your
              linked characters.
            </Typography>
          </Stack>
        </Paper>
      </Box>
    );
  }

  if (discoveryQuery.isLoading || discoveryQuery.isPending || state?.kind === "single") {
    return (
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography color="text.secondary">Resolving linked characters…</Typography>
        </Stack>
      </Box>
    );
  }

  if (state?.kind === "empty") {
    return <LookupEmptyState />;
  }

  if (state?.kind === "multiple") {
    return (
      <CharacterSelectionPage
        access={{
          source: "eve-vault",
          walletAddress: walletSession.walletAddress,
          world,
        }}
        address={walletSession.walletAddress}
        characters={state.characters}
      />
    );
  }

  return null;
}
