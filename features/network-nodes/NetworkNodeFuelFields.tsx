import { Stack, Typography } from "@mui/material";

import { formatFuelEta } from "@/lib/eve/fuel";
import type { NetworkNodeDetailSummary } from "@/lib/eve/types";

interface NetworkNodeFuelFieldsProps {
  networkNode: NetworkNodeDetailSummary;
}

export default function NetworkNodeFuelFields({
  networkNode,
}: NetworkNodeFuelFieldsProps) {
  return (
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Typography color="text.secondary">Fuel percentage</Typography>
        <Typography>
          {networkNode.fuelPercent === null ? "Unavailable" : `${networkNode.fuelPercent}%`}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Typography color="text.secondary">Fuel quantity</Typography>
        <Typography>
          {networkNode.fuelQuantity === null ? "Unavailable" : networkNode.fuelQuantity}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Typography color="text.secondary">Fuel ETA</Typography>
        <Typography>{formatFuelEta(networkNode.fuelEtaMs)}</Typography>
      </Stack>
    </Stack>
  );
}
