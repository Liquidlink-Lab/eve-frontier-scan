import { Chip, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";

import LinkButton from "@/features/navigation/LinkButton";
import { buildDashboardAssemblyDetailHref } from "@/lib/eve/routes";
import type { ConnectedAssemblyGroup, WalletAccessContext } from "@/lib/eve/types";

interface ConnectedAssembliesListProps {
  access: WalletAccessContext;
  characterId?: string;
  groups: ConnectedAssemblyGroup[];
}

export default function ConnectedAssembliesList({
  access,
  characterId,
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
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={assembly.status}
                      size="small"
                      variant="outlined"
                      color={assembly.status === "online" ? "success" : "default"}
                    />
                    {characterId ? (
                      <LinkButton
                        href={buildDashboardAssemblyDetailHref(
                          characterId,
                          assembly.id,
                          access,
                        )}
                        size="small"
                      >
                        Details
                      </LinkButton>
                    ) : null}
                  </Stack>
                </ListItem>
              ))}
            </List>
          )}
        </div>
      ))}
    </Stack>
  );
}
