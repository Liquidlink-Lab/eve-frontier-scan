import {
  Chip,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

import LinkButton from "@/features/navigation/LinkButton";
import { formatFuelEta } from "@/lib/eve/fuel";
import { buildDashboardNetworkNodeDetailHref } from "@/lib/eve/routes";
import type {
  NetworkNodeSummary,
  WalletAccessContext,
} from "@/lib/eve/types";

interface NetworkNodeTableRowProps {
  access: WalletAccessContext;
  characterId: string;
  networkNode: NetworkNodeSummary;
}

export default function NetworkNodeTableRow({
  access,
  characterId,
  networkNode,
}: NetworkNodeTableRowProps) {
  return (
    <TableRow hover>
      <TableCell>
        <Chip
          label={networkNode.status}
          color={networkNode.status === "online" ? "success" : "default"}
          size="small"
          variant="outlined"
        />
      </TableCell>
      <TableCell>
        <Typography fontWeight={600}>{networkNode.name}</Typography>
      </TableCell>
      <TableCell>{networkNode.systemName ?? "Unknown"}</TableCell>
      <TableCell>
        <Stack spacing={0.25}>
          <Typography>
            {networkNode.fuelPercent === null ? "Unavailable" : `${networkNode.fuelPercent}%`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ETA {formatFuelEta(networkNode.fuelEtaMs)}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>{networkNode.connectedAssemblyCount}</TableCell>
      <TableCell align="right">
        <LinkButton
          href={buildDashboardNetworkNodeDetailHref(
            characterId,
            networkNode.id,
            access,
          )}
          size="small"
        >
          Details
        </LinkButton>
      </TableCell>
    </TableRow>
  );
}
