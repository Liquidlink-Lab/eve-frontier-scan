import Link from "next/link";
import {
  Button,
  Chip,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

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
        {networkNode.fuelPercent === null ? "Unavailable" : `${networkNode.fuelPercent}%`}
      </TableCell>
      <TableCell>{networkNode.connectedAssemblyCount}</TableCell>
      <TableCell align="right">
        <Button
          component={Link}
          href={buildDashboardNetworkNodeDetailHref(
            characterId,
            networkNode.id,
            access,
          )}
          size="small"
        >
          Details
        </Button>
      </TableCell>
    </TableRow>
  );
}
