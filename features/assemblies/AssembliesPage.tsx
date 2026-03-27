import { Box, Paper, Stack, Typography } from "@mui/material";

import type { AssemblySummary, WalletAccessContext } from "@/lib/eve/types";
import AssemblyGroupSection from "./AssemblyGroupSection";

interface AssembliesPageProps {
  access: WalletAccessContext;
  characterId: string;
  characterName: string;
  groups: Record<string, AssemblySummary[]>;
}

export default function AssembliesPage({
  access,
  characterId,
  characterName,
  groups,
}: AssembliesPageProps) {
  const populatedGroups = Object.entries(groups).filter(([, assemblies]) => assemblies.length > 0);

  return (
    <Box component="main" sx={{ flex: 1, px: 3, py: { xs: 4, md: 6 } }}>
      <Stack spacing={3} sx={{ maxWidth: 1120, mx: "auto" }}>
        <div>
          <Typography variant="h3">Assemblies</Typography>
          <Typography color="text.secondary">
            {characterName} grouped by structure type
          </Typography>
        </div>

        {populatedGroups.length === 0 ? (
          <Paper elevation={0} sx={{ px: 4, py: 5 }}>
            <Stack spacing={1.5}>
              <Typography variant="h5">No assemblies found</Typography>
              <Typography color="text.secondary">
                This character does not currently resolve any non-node structures.
              </Typography>
            </Stack>
          </Paper>
        ) : (
          populatedGroups.map(([groupLabel, assemblies]) => (
            <AssemblyGroupSection
              key={groupLabel}
              access={access}
              characterId={characterId}
              groupLabel={groupLabel}
              assemblies={assemblies}
            />
          ))
        )}
      </Stack>
    </Box>
  );
}
