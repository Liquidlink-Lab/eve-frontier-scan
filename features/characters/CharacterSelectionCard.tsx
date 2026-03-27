import { Chip, Paper, Stack, Typography } from "@mui/material";

import LinkButton from "@/features/navigation/LinkButton";
import { formatShortAddress } from "@/lib/eve/address";
import { buildDashboardNetworkNodesHref } from "@/lib/eve/routes";
import type { CharacterSummary } from "@/lib/eve/types";

interface CharacterSelectionCardProps {
  character: CharacterSummary;
}

function formatNodeCount(count: number) {
  return count === 1 ? "1 Network Node" : `${count} Network Nodes`;
}

export default function CharacterSelectionCard({
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
          {character.currentShipName ?? "Ship data unavailable"}
        </Typography>
        <LinkButton
          href={buildDashboardNetworkNodesHref(character.id, {
            walletAddress: character.walletAddress,
            source: character.walletSource,
          })}
          variant="contained"
        >
          Open dashboard
        </LinkButton>
      </Stack>
    </Paper>
  );
}
