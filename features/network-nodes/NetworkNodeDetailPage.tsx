import {
  Box,
  Chip,
  Link as MuiLink,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import LinkButton from "@/features/navigation/LinkButton";
import { formatShortAddress } from "@/lib/eve/address";
import { buildDashboardNetworkNodesHref } from "@/lib/eve/routes";
import { getSuiscanObjectUrl } from "@/lib/eve/suiscan";
import type { NetworkNodeDetailSummary, WalletAccessContext } from "@/lib/eve/types";
import ConnectedAssembliesList from "./ConnectedAssembliesList";
import NetworkNodeFuelFields from "./NetworkNodeFuelFields";

interface NetworkNodeDetailPageProps {
  access: WalletAccessContext;
  characterId?: string;
  characterName: string;
  networkNode: NetworkNodeDetailSummary;
}

export default function NetworkNodeDetailPage({
  access,
  characterId,
  characterName,
  networkNode,
}: NetworkNodeDetailPageProps) {
  return (
    <Box component="main" sx={{ flex: 1, px: 3, py: { xs: 4, md: 6 } }}>
      <Stack spacing={3} sx={{ maxWidth: 1040, mx: "auto" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <div>
            <Typography variant="overline" color="text.secondary">
              {characterName}
            </Typography>
            <Typography variant="h3">{networkNode.name}</Typography>
            <MuiLink
              href={getSuiscanObjectUrl(networkNode.id)}
              underline="hover"
              target="_blank"
              rel="noreferrer"
            >
              {formatShortAddress(networkNode.id)}
            </MuiLink>
          </div>
          {characterId ? (
            <LinkButton
              href={buildDashboardNetworkNodesHref(characterId, access)}
              variant="outlined"
            >
              Back to Network Nodes
            </LinkButton>
          ) : null}
        </Stack>

        <Paper elevation={0} sx={{ px: 3, py: 3 }}>
          <Stack spacing={2.5}>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography color="text.secondary">Solar system</Typography>
              <Typography>{networkNode.systemName ?? "Unknown"}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography color="text.secondary">Status</Typography>
              <Chip
                label={networkNode.status}
                color={networkNode.status === "online" ? "success" : "default"}
                size="small"
                variant="outlined"
              />
            </Stack>
            <NetworkNodeFuelFields networkNode={networkNode} />
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ px: 3, py: 3 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Related assemblies
          </Typography>
          <ConnectedAssembliesList groups={networkNode.connectedAssemblyGroups} />
        </Paper>
      </Stack>
    </Box>
  );
}
