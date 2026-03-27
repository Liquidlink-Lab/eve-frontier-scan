import {
  Chip,
  Link as MuiLink,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { formatShortAddress } from "@/lib/eve/address";
import { getSuiscanObjectUrl } from "@/lib/eve/suiscan";
import { getAssemblyWikiUrl } from "@/lib/eve/wikiLinks";
import type { AssemblySummary } from "@/lib/eve/types";

interface AssemblyDetailPageProps {
  characterName: string;
  assembly: AssemblySummary;
}

export default function AssemblyDetailPage({
  characterName,
  assembly,
}: AssemblyDetailPageProps) {
  const wikiUrl = getAssemblyWikiUrl(assembly.typeLabel);

  return (
    <main>
      <Stack spacing={3} sx={{ maxWidth: 960, mx: "auto", px: 3, py: { xs: 4, md: 6 } }}>
        <div>
          <Typography variant="overline" color="text.secondary">
            {characterName}
          </Typography>
          <Typography variant="h3">{assembly.name}</Typography>
          <MuiLink
            href={getSuiscanObjectUrl(assembly.id)}
            underline="hover"
            target="_blank"
            rel="noreferrer"
          >
            {formatShortAddress(assembly.id)}
          </MuiLink>
        </div>

        <Paper elevation={0} sx={{ px: 3, py: 3 }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography color="text.secondary">Type</Typography>
              {wikiUrl ? (
                <MuiLink href={wikiUrl} underline="hover" target="_blank" rel="noreferrer">
                  {assembly.typeLabel}
                </MuiLink>
              ) : (
                <Typography>{assembly.typeLabel}</Typography>
              )}
            </Stack>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography color="text.secondary">Solar system</Typography>
              <Typography>{assembly.systemName ?? "Unknown"}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography color="text.secondary">Coordinates</Typography>
              <Typography>
                {assembly.location
                  ? `${assembly.location.x}, ${assembly.location.y}, ${assembly.location.z}`
                  : "Unavailable"}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography color="text.secondary">Status</Typography>
              <Chip
                label={assembly.status}
                color={assembly.status === "online" ? "success" : "default"}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </main>
  );
}
