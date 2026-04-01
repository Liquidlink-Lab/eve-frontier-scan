import { redirect } from "next/navigation";

import CharacterSelectionPage, {
  resolveCharacterLookupState,
} from "@/features/characters/CharacterSelectionPage";
import LookupEmptyState from "@/features/lookup/LookupEmptyState";
import { normalizeSuiAddress } from "@/lib/eve/address";
import { fetchWalletStructureDiscovery } from "@/lib/eve/discovery/eveOwnershipClient";
import { parseEveWorld } from "@/lib/eve/env";
import { eveLabelLookups } from "@/lib/eve/lookups";

interface LookupCharactersPageProps {
  params: Promise<{
    address: string;
  }>;
  searchParams: Promise<{
    world?: string;
  }>;
}

export default async function LookupCharactersPage({
  params,
  searchParams,
}: LookupCharactersPageProps) {
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

  if (state.kind === "empty") {
    return <LookupEmptyState />;
  }

  return (
    <CharacterSelectionPage
      access={{
        source: "sui-address",
        walletAddress: normalizedAddress,
        world: eveWorld,
      }}
      address={normalizedAddress}
      characters={state.characters}
    />
  );
}
