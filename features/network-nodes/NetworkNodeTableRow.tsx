import {
  Chip,
  LinearProgress,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

import TypeIcon from "@/features/icons/TypeIcon";
import LinkButton from "@/features/navigation/LinkButton";
import { formatFuelEta } from "@/lib/eve/fuel";
import { clampPercentage, formatPercentage } from "@/lib/eve/percent";
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
        <Stack direction="row" spacing={1.25} alignItems="center">
          <TypeIcon iconUrl={networkNode.iconUrl} label="Network Node" size={28} />
          <Typography fontWeight={600}>{networkNode.name}</Typography>
        </Stack>
      </TableCell>
      <TableCell>{networkNode.systemName ?? "Unknown"}</TableCell>
      <TableCell>
        <Stack spacing={0.5}>
          <Typography>{formatPercentage(networkNode.fuelPercent)}</Typography>
          {networkNode.fuelPercent !== null ? (
            <LinearProgress
              aria-label="Fuel level"
              variant="determinate"
              value={clampPercentage(networkNode.fuelPercent)}
              sx={{ height: 6, borderRadius: 999 }}
            />
          ) : null}
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
