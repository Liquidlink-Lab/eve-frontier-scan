import {
  Chip,
  LinearProgress,
  Link as MuiLink,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import DashboardRefreshButton from "@/features/dashboard/DashboardRefreshButton";
import { formatShortAddress } from "@/lib/eve/address";
import { calculatePercentage, clampPercentage, formatPercentage } from "@/lib/eve/percent";
import { getSuiscanObjectUrl } from "@/lib/eve/suiscan";
import { getAssemblyWikiUrl } from "@/lib/eve/wikiLinks";
import type { AssemblyDetailSummary, StorageInventorySummary } from "@/lib/eve/types";

interface AssemblyDetailPageProps {
  characterName: string;
  assembly: AssemblyDetailSummary;
  storageInventory?: StorageInventorySummary | null;
}

export default function AssemblyDetailPage({
  characterName,
  assembly,
  storageInventory,
}: AssemblyDetailPageProps) {
  const wikiUrl = getAssemblyWikiUrl(assembly.typeLabel);
  const storageCapacityPercent = storageInventory
    ? calculatePercentage(storageInventory.usedCapacity, storageInventory.maxCapacity)
    : null;

  return (
    <main>
      <Stack spacing={3} sx={{ maxWidth: 960, mx: "auto", px: 3, py: { xs: 4, md: 6 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
        >
          <div>
            <Typography variant="overline" color="text.secondary">
              {characterName}
            </Typography>
            <Typography variant="h3">{assembly.name}</Typography>
            <MuiLink
              href={getSuiscanObjectUrl(assembly.id)}
              underline="hover"
              target="_blank"
              rel="noreferrer"
            >
              {formatShortAddress(assembly.id)}
            </MuiLink>
          </div>
          <DashboardRefreshButton />
        </Stack>

        <Paper elevation={0} sx={{ px: 3, py: 3 }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography color="text.secondary">Type</Typography>
              {wikiUrl ? (
                <MuiLink href={wikiUrl} underline="hover" target="_blank" rel="noreferrer">
                  {assembly.typeLabel}
                </MuiLink>
              ) : (
                <Typography>{assembly.typeLabel}</Typography>
              )}
            </Stack>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography color="text.secondary">Solar system</Typography>
              <Typography>{assembly.systemName ?? "Unknown"}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography color="text.secondary">Coordinates</Typography>
              <Typography>
                {assembly.location
                  ? `${assembly.location.x}, ${assembly.location.y}, ${assembly.location.z}`
                  : "Unavailable"}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography color="text.secondary">Status</Typography>
              <Chip
                label={assembly.status}
                color={assembly.status === "online" ? "success" : "default"}
                size="small"
                variant="outlined"
              />
            </Stack>
            {assembly.description ? (
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography color="text.secondary">Description</Typography>
                <Typography>{assembly.description}</Typography>
              </Stack>
            ) : null}
            {assembly.url ? (
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography color="text.secondary">Reference URL</Typography>
                <MuiLink href={assembly.url} underline="hover" target="_blank" rel="noreferrer">
                  {assembly.url}
                </MuiLink>
              </Stack>
            ) : null}
            {assembly.itemId !== null ? (
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography color="text.secondary">Tenant item ID</Typography>
                <Typography>{assembly.itemId}</Typography>
              </Stack>
            ) : null}
            {assembly.tenant ? (
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography color="text.secondary">Tenant</Typography>
                <Typography>{assembly.tenant}</Typography>
              </Stack>
            ) : null}
            {assembly.ownerCapId ? (
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography color="text.secondary">Owner Cap</Typography>
                <Typography>{assembly.ownerCapId}</Typography>
              </Stack>
            ) : null}
            {assembly.energySourceId ? (
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography color="text.secondary">Powered by</Typography>
                <Typography>
                  {assembly.energySourceName ?? formatShortAddress(assembly.energySourceId)}
                </Typography>
              </Stack>
            ) : null}
            {(assembly.extensionType || assembly.extensionLabel) ? (
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography color="text.secondary">Extension</Typography>
                <Stack spacing={0.5} sx={{ alignItems: "flex-end" }}>
                  <Typography>{assembly.extensionLabel}</Typography>
                  {assembly.extensionType ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontFamily: "monospace" }}
                    >
                      {assembly.extensionType}
                    </Typography>
                  ) : null}
                </Stack>
              </Stack>
            ) : null}
            {assembly.linkedGateId ? (
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography color="text.secondary">Linked gate</Typography>
                <Typography>
                  {assembly.linkedGateName ?? formatShortAddress(assembly.linkedGateId)}
                </Typography>
              </Stack>
            ) : null}
            {assembly.gateAccessMode ? (
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography color="text.secondary">Access mode</Typography>
                <Typography>{assembly.gateAccessMode}</Typography>
              </Stack>
            ) : null}
          </Stack>
        </Paper>

        {storageInventory ? (
          <Paper elevation={0} sx={{ px: 3, py: 3 }}>
            <Stack spacing={2}>
              <Typography component="h2" variant="h4">
                Inventory
              </Typography>
              <Stack spacing={0.75}>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography color="text.secondary">Capacity used</Typography>
                  <Typography>{formatPercentage(storageCapacityPercent)}</Typography>
                </Stack>
                {storageCapacityPercent !== null ? (
                  <LinearProgress
                    aria-label="Storage capacity usage"
                    variant="determinate"
                    value={clampPercentage(storageCapacityPercent)}
                    sx={{ height: 8, borderRadius: 999 }}
                  />
                ) : null}
                <Typography variant="body2" color="text.secondary">
                  {storageInventory.usedCapacity === null ||
                  storageInventory.maxCapacity === null
                    ? "Capacity unavailable"
                    : `${storageInventory.usedCapacity} / ${storageInventory.maxCapacity} used`}
                </Typography>
              </Stack>
              {storageInventory.items.length === 0 ? (
                <Typography color="text.secondary">No inventory items found.</Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item name</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Volume</TableCell>
                      <TableCell align="right">Item ID</TableCell>
                      <TableCell align="right">Type ID</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {storageInventory.items.map((item) => (
                      <TableRow key={`${item.typeId}:${item.itemId}`}>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{item.volume}</TableCell>
                        <TableCell align="right">{item.itemId}</TableCell>
                        <TableCell align="right">{item.typeId}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Stack>
          </Paper>
        ) : null}
      </Stack>
    </main>
  );
}
