import { redirect } from "next/navigation";

import { resolveCharacterLookupState } from "@/features/characters/CharacterSelectionPage";
import LookupEmptyState from "@/features/lookup/LookupEmptyState";
import { normalizeSuiAddress } from "@/lib/eve/address";
import { fetchWalletStructureDiscovery } from "@/lib/eve/discovery/eveOwnershipClient";
import { parseEveWorld } from "@/lib/eve/env";
import { eveLabelLookups } from "@/lib/eve/lookups";
import { buildLookupCharactersHref } from "@/lib/eve/routes";

interface LookupPageProps {
  params: Promise<{
    address: string;
  }>;
  searchParams: Promise<{
    world?: string;
  }>;
}

export default async function LookupPage({
  params,
  searchParams,
}: LookupPageProps) {
  const { address } = await params;
  const { world } = await searchParams;
  const eveWorld = parseEveWorld(world);
  const normalizedAddress = normalizeSuiAddress(address);

  if (!normalizedAddress) {
    return <LookupEmptyState />;
  }

  const discovery = await fetchWalletStructureDiscovery(normalizedAddress, eveWorld);
  const state = resolveCharacterLookupState(
    discovery,
    {
      source: "sui-address",
      walletAddress: normalizedAddress,
      world: eveWorld,
    },
    eveLabelLookups,
  );

  if (state.kind === "single") {
    redirect(state.redirectTo);
  }

  if (state.kind === "multiple") {
    redirect(buildLookupCharactersHref(normalizedAddress, eveWorld));
  }

  return <LookupEmptyState />;
}
