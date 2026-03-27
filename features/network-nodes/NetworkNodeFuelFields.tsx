import { LinearProgress, Stack, Typography } from "@mui/material";

import { formatFuelEta } from "@/lib/eve/fuel";
import { clampPercentage, formatPercentage } from "@/lib/eve/percent";
import type { NetworkNodeDetailSummary } from "@/lib/eve/types";

interface NetworkNodeFuelFieldsProps {
  networkNode: NetworkNodeDetailSummary;
}

export default function NetworkNodeFuelFields({
  networkNode,
}: NetworkNodeFuelFieldsProps) {
  const fuelPercent = networkNode.fuelPercent;

  return (
    <Stack spacing={1}>
      <Stack spacing={0.75}>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Typography color="text.secondary">Fuel percentage</Typography>
          <Typography>{formatPercentage(fuelPercent)}</Typography>
        </Stack>
        {fuelPercent !== null ? (
          <LinearProgress
            aria-label="Fuel level"
            variant="determinate"
            value={clampPercentage(fuelPercent)}
            sx={{ height: 8, borderRadius: 999 }}
          />
        ) : null}
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
