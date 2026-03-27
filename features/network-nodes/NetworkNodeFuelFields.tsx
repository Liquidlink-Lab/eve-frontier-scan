import { LinearProgress, Stack, Typography } from "@mui/material";

import DetailField from "@/features/dashboard/DetailField";
import TypeIcon from "@/features/icons/TypeIcon";
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
      <DetailField label="Fuel type">
        {networkNode.fuelTypeName ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <TypeIcon
              iconUrl={networkNode.fuelTypeIconUrl}
              label={networkNode.fuelTypeName}
              size={24}
            />
            <Typography>{networkNode.fuelTypeName}</Typography>
          </Stack>
        ) : (
          <Typography>Unavailable</Typography>
        )}
      </DetailField>
      <Stack spacing={0.75}>
        <DetailField label="Fuel percentage">
          <Typography>{formatPercentage(fuelPercent)}</Typography>
        </DetailField>
        {fuelPercent !== null ? (
          <LinearProgress
            aria-label="Fuel level"
            variant="determinate"
            value={clampPercentage(fuelPercent)}
            sx={{ height: 8, borderRadius: 999 }}
          />
        ) : null}
      </Stack>
      <DetailField label="Fuel quantity">
        <Typography>
          {networkNode.fuelQuantity === null ? "Unavailable" : networkNode.fuelQuantity}
        </Typography>
      </DetailField>
      <DetailField label="Fuel ETA">
        <Typography>{formatFuelEta(networkNode.fuelEtaMs)}</Typography>
      </DetailField>
    </Stack>
  );
}
