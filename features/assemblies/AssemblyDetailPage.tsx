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

import { formatShortAddress } from "@/lib/eve/address";
import { calculatePercentage, clampPercentage, formatPercentage } from "@/lib/eve/percent";
import { getSuiscanObjectUrl } from "@/lib/eve/suiscan";
import { getAssemblyWikiUrl } from "@/lib/eve/wikiLinks";
import type { AssemblySummary, StorageInventorySummary } from "@/lib/eve/types";

interface AssemblyDetailPageProps {
  characterName: string;
  assembly: AssemblySummary;
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
