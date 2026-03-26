import { Box, Paper, Stack, Typography } from "@mui/material";

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
    <Box component="main" sx={{ flex: 1, px: 3, py: { xs: 4, md: 6 } }}>
      <Stack spacing={3} sx={{ maxWidth: 1120, mx: "auto" }}>
        <div>
          <Typography variant="h3">Network Nodes</Typography>
          <Typography color="text.secondary">
            {characterName} node index
          </Typography>
        </div>

        {sortedNetworkNodes.length === 0 ? (
          <Paper elevation={0} sx={{ px: 4, py: 5 }}>
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
