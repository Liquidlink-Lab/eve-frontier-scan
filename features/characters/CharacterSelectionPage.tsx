import { Box, Stack, Typography } from "@mui/material";

import type {
  CharacterSummary,
  LabelLookups,
  WalletAccessContext,
  WalletStructureDiscovery,
} from "@/lib/eve/types";
import { mapDiscoveryToCharacterSummaries } from "@/lib/eve/discovery/eveOwnershipMappers";
import { buildDashboardNetworkNodesHref } from "@/lib/eve/routes";
import CharacterSelectionCard from "./CharacterSelectionCard";

export type CharacterLookupState =
  | {
      kind: "empty";
    }
  | {
      kind: "single";
      characterId: string;
      redirectTo: string;
    }
  | {
      kind: "multiple";
      characters: CharacterSummary[];
    };

interface CharacterSelectionPageProps {
  address: string;
  characters: CharacterSummary[];
}

export function resolveCharacterLookupState(
  discovery: WalletStructureDiscovery,
  access: WalletAccessContext,
  lookups: LabelLookups,
): CharacterLookupState {
  const characters = mapDiscoveryToCharacterSummaries(discovery, access, lookups);

  if (characters.length === 0) {
    return {
      kind: "empty",
    };
  }

  if (characters.length === 1) {
    return {
      kind: "single",
      characterId: characters[0].id,
      redirectTo: buildDashboardNetworkNodesHref(
        characters[0].id,
        access.walletAddress,
      ),
    };
  }

  return {
    kind: "multiple",
    characters,
  };
}

export default function CharacterSelectionPage({
  address,
  characters,
}: CharacterSelectionPageProps) {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        px: 3,
        py: { xs: 4, md: 6 },
      }}
    >
      <Stack spacing={3} sx={{ maxWidth: 960, mx: "auto" }}>
        <div>
          <Typography variant="h3">Select a character</Typography>
          <Typography color="text.secondary">
            Wallet lookup resolved multiple pilots for {address}.
          </Typography>
        </div>
        <Stack spacing={2}>
          {characters.map((character) => (
            <CharacterSelectionCard key={character.id} character={character} />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
