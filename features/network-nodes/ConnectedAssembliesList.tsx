import { Chip, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";

import type { ConnectedAssemblyGroup } from "@/lib/eve/types";

interface ConnectedAssembliesListProps {
  groups: ConnectedAssemblyGroup[];
}

export default function ConnectedAssembliesList({
  groups,
}: ConnectedAssembliesListProps) {
  return (
    <Stack spacing={3}>
      {groups.map((group) => (
        <div key={group.label}>
          <Typography component="h2" variant="h5" sx={{ mb: 1.5 }}>
            {group.label}
          </Typography>
          {group.assemblies.length === 0 ? (
            <Typography color="text.secondary">No connected assemblies.</Typography>
          ) : (
            <List disablePadding>
              {group.assemblies.map((assembly) => (
                <ListItem
                  key={assembly.id}
                  disableGutters
                  sx={{
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <ListItemText
                    primary={assembly.name}
                    secondary={assembly.typeLabel}
                    sx={{ my: 0 }}
                  />
                  <Chip label={assembly.status} size="small" variant="outlined" />
                </ListItem>
              ))}
            </List>
          )}
        </div>
      ))}
    </Stack>
  );
}
