import { Box, Paper, Stack, Typography } from "@mui/material";

import DashboardRefreshButton from "@/features/dashboard/DashboardRefreshButton";
import type {
  NetworkNodeSummary,
  WalletAccessContext,
} from "@/lib/eve/types";
import NetworkNodeTable from "./NetworkNodeTable";

interface NetworkNodesPageProps {
  access: WalletAccessContext;
  characterId: string;
  characterName: string;
  networkNodes: NetworkNodeSummary[];
}

export default function NetworkNodesPage({
  access,
  characterId,
  characterName,
  networkNodes,
}: NetworkNodesPageProps) {
  const sortedNetworkNodes = [...networkNodes].sort((left, right) => {
    const connectedAssemblyDifference =
      right.connectedAssemblyCount - left.connectedAssemblyCount;

    if (connectedAssemblyDifference !== 0) {
      return connectedAssemblyDifference;
    }

    const leftFuelSortValue = left.fuelPercent ?? Number.POSITIVE_INFINITY;
    const rightFuelSortValue = right.fuelPercent ?? Number.POSITIVE_INFINITY;
    const fuelDifference = leftFuelSortValue - rightFuelSortValue;

    if (fuelDifference !== 0) {
      return fuelDifference;
    }

    return left.name.localeCompare(right.name);
  });

  return (
    <Box component="main" sx={{ flex: 1, px: { xs: 2, sm: 3 }, py: { xs: 4, md: 6 } }}>
      <Stack spacing={3} sx={{ maxWidth: 1120, mx: "auto" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
        >
          <div>
            <Typography variant="h3">Network Nodes</Typography>
            <Typography color="text.secondary">
              {characterName} node index
            </Typography>
          </div>
          <DashboardRefreshButton />
        </Stack>

        {sortedNetworkNodes.length === 0 ? (
          <Paper elevation={0} sx={{ px: { xs: 3, sm: 4 }, py: { xs: 4, sm: 5 } }}>
            <Stack spacing={1.5}>
              <Typography variant="h5">No network nodes found</Typography>
              <Typography color="text.secondary">
                You can switch to another character or check Assemblies to see
                whether this character only has linked structures.
              </Typography>
            </Stack>
          </Paper>
        ) : (
          <NetworkNodeTable
            access={access}
            characterId={characterId}
            networkNodes={sortedNetworkNodes}
          />
        )}
      </Stack>
    </Box>
  );
}
