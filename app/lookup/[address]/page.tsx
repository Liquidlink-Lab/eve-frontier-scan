import { redirect } from "next/navigation";

import { resolveCharacterLookupState } from "@/features/characters/CharacterSelectionPage";
import LookupEmptyState from "@/features/lookup/LookupEmptyState";
import { normalizeSuiAddress } from "@/lib/eve/address";
import { fetchWalletStructureDiscovery } from "@/lib/eve/discovery/eveOwnershipClient";
import { eveLabelLookups } from "@/lib/eve/lookups";

interface LookupPageProps {
  params: Promise<{
    address: string;
  }>;
}

export default async function LookupPage({ params }: LookupPageProps) {
  const { address } = await params;
  const normalizedAddress = normalizeSuiAddress(address);

  if (!normalizedAddress) {
    return <LookupEmptyState />;
  }

  const discovery = await fetchWalletStructureDiscovery(normalizedAddress);
  const state = resolveCharacterLookupState(
    discovery,
    {
      source: "sui-address",
      walletAddress: normalizedAddress,
    },
    eveLabelLookups,
  );

  if (state.kind === "single") {
    redirect(state.redirectTo);
  }

  if (state.kind === "multiple") {
    redirect(`/lookup/${normalizedAddress}/characters`);
  }

  return <LookupEmptyState />;
}
