import { Chip, Paper, Stack, Typography } from "@mui/material";

import LinkButton from "@/features/navigation/LinkButton";
import { formatShortAddress } from "@/lib/eve/address";
import { buildDashboardDefaultHref } from "@/lib/eve/routes";
import type { CharacterSummary, WalletAccessContext } from "@/lib/eve/types";

interface CharacterSelectionCardProps {
  access: WalletAccessContext;
  character: CharacterSummary;
}

function formatNodeCount(count: number) {
  return count === 1 ? "1 Network Node" : `${count} Network Nodes`;
}

function formatOwnedStructureCount(count: number) {
  return count === 1 ? "1 Owned Structure" : `${count} Owned Structures`;
}

export default function CharacterSelectionCard({
  access,
  character,
}: CharacterSelectionCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        px: 3,
        py: 2.5,
        borderRadius: 3,
      }}
    >
      <Stack spacing={1.5}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={1}
        >
          <div>
            <Typography variant="h5">{character.name}</Typography>
            <Typography color="text.secondary">{character.tribeName}</Typography>
          </div>
          <Chip
            label={`${character.walletSourceLabel} · ${formatShortAddress(character.walletAddress)}`}
            variant="outlined"
          />
        </Stack>
        <Typography color="text.secondary">
          {formatNodeCount(character.networkNodeCount)}
        </Typography>
        <Typography color="text.secondary">
          {formatOwnedStructureCount(character.ownedStructureCount)}
        </Typography>
        <Typography color="text.secondary">
          {`Character ID ${formatShortAddress(character.id)}`}
        </Typography>
        <Typography color="text.secondary">
          {character.currentShipName ?? "Ship data unavailable"}
        </Typography>
        <LinkButton
          href={buildDashboardDefaultHref(
            character.id,
            {
              walletAddress: character.walletAddress,
              source: character.walletSource,
              world: access.world,
            },
            character.defaultDashboardSection,
          )}
          variant="contained"
        >
          Open dashboard
        </LinkButton>
      </Stack>
    </Paper>
  );
}
