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
import TypeIcon from "@/features/icons/TypeIcon";
import LinkText from "@/features/navigation/LinkText";
import { formatShortAddress } from "@/lib/eve/address";
import { calculatePercentage, clampPercentage, formatPercentage } from "@/lib/eve/percent";
import { buildDashboardNetworkNodeDetailHref } from "@/lib/eve/routes";
import { getSuiscanObjectUrl } from "@/lib/eve/suiscan";
import type {
  AssemblyDetailSummary,
  StorageInventorySummary,
  WalletAccessContext,
} from "@/lib/eve/types";

interface AssemblyDetailPageProps {
  access?: WalletAccessContext;
  characterId?: string;
  characterName: string;
  assembly: AssemblyDetailSummary;
  storageInventory?: StorageInventorySummary | null;
}

export default function AssemblyDetailPage({
  access,
  characterId,
  characterName,
  assembly,
  storageInventory,
}: AssemblyDetailPageProps) {
  const storageCapacityPercent = storageInventory
    ? calculatePercentage(storageInventory.usedCapacity, storageInventory.maxCapacity)
    : null;
  const energySourceHref =
    access && characterId && assembly.energySourceId
      ? buildDashboardNetworkNodeDetailHref(
          characterId,
          assembly.energySourceId,
          access,
        )
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
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <TypeIcon
              iconUrl={assembly.iconUrl}
              label={assembly.typeLabel}
              size={64}
              desktopSize={80}
            />
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
          </Stack>
          <DashboardRefreshButton />
        </Stack>

        <Paper elevation={0} sx={{ px: 3, py: 3 }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography color="text.secondary">Type</Typography>
              <Typography>{assembly.typeLabel}</Typography>
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
            {assembly.energySourceId ? (
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography color="text.secondary">Powered by</Typography>
                {energySourceHref ? (
                  <LinkText href={energySourceHref} underline="hover">
                    {assembly.energySourceName ?? formatShortAddress(assembly.energySourceId)}
                  </LinkText>
                ) : (
                  <Typography>
                    {assembly.energySourceName ?? formatShortAddress(assembly.energySourceId)}
                  </Typography>
                )}
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
            {assembly.extensionFrozen !== null ? (
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography color="text.secondary">Extension frozen</Typography>
                <Typography>{assembly.extensionFrozen ? "Yes" : "No"}</Typography>
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

        {assembly.typeRepr.includes("::gate::Gate") ? (
          <Paper elevation={0} sx={{ px: 3, py: 3 }}>
            <Stack spacing={2}>
              <Typography component="h2" variant="h4">
                Gate operations
              </Typography>
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography color="text.secondary">Max link distance</Typography>
                <Typography>
                  {assembly.gateMaxLinkDistance === null ||
                  assembly.gateMaxLinkDistance === undefined
                    ? "Unavailable"
                    : String(assembly.gateMaxLinkDistance)}
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <Typography color="text.secondary">Recent jumps</Typography>
                {(assembly.recentJumps ?? []).length === 0 ? (
                  <Typography color="text.secondary">No recent jumps found.</Typography>
                ) : (
                  (assembly.recentJumps ?? []).map((jump) => (
                    <Stack key={jump.txDigest} spacing={0.25}>
                      <Typography>
                        {`${formatTimestamp(jump.timestampMs)} · ${formatGateRoute(
                          jump.sourceGateName,
                          jump.sourceGateId,
                          jump.destinationGateName,
                          jump.destinationGateId,
                        )}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatPilotLabel(jump.characterId)}
                      </Typography>
                    </Stack>
                  ))
                )}
              </Stack>
              <Stack spacing={1}>
                <Typography color="text.secondary">Recent permits</Typography>
                {(assembly.recentPermits ?? []).length === 0 ? (
                  <Typography color="text.secondary">No recent permits found.</Typography>
                ) : (
                  (assembly.recentPermits ?? []).map((permit) => (
                    <Stack key={permit.txDigest} spacing={0.25}>
                      <Typography>
                        {`${formatTimestamp(permit.expiresAtMs)} · Permit ${permit.jumpPermitId}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {`${formatGateRoute(
                          permit.sourceGateName,
                          permit.sourceGateId,
                          permit.destinationGateName,
                          permit.destinationGateId,
                        )} · ${formatPilotLabel(permit.characterId)}`}
                      </Typography>
                    </Stack>
                  ))
                )}
              </Stack>
            </Stack>
          </Paper>
        ) : null}

        {assembly.typeRepr.includes("::turret::Turret") ? (
          <Paper elevation={0} sx={{ px: 3, py: 3 }}>
            <Stack spacing={2}>
              <Typography component="h2" variant="h4">
                Latest target priority snapshot
              </Typography>
              {assembly.latestTurretPrioritySnapshot ? (
                <>
                  <Stack direction="row" justifyContent="space-between" spacing={2}>
                    <Typography color="text.secondary">Updated at</Typography>
                    <Typography>
                      {formatTimestamp(assembly.latestTurretPrioritySnapshot.updatedAtMs)}
                    </Typography>
                  </Stack>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item ID</TableCell>
                        <TableCell align="right">Type ID</TableCell>
                        <TableCell align="right">Group ID</TableCell>
                        <TableCell align="right">Character</TableCell>
                        <TableCell align="right">Tribe</TableCell>
                        <TableCell align="right">HP</TableCell>
                        <TableCell align="right">Shield</TableCell>
                        <TableCell align="right">Armor</TableCell>
                        <TableCell align="right">Priority</TableCell>
                        <TableCell>Behaviour</TableCell>
                        <TableCell>Aggressor</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assembly.latestTurretPrioritySnapshot.targets.map((target) => (
                        <TableRow key={`${target.itemId}:${target.priorityWeight}`}>
                          <TableCell>{target.itemId}</TableCell>
                          <TableCell align="right">{target.typeId}</TableCell>
                          <TableCell align="right">{target.groupId}</TableCell>
                          <TableCell align="right">{target.characterId}</TableCell>
                          <TableCell align="right">{target.characterTribe}</TableCell>
                          <TableCell align="right">{target.hpRatio}</TableCell>
                          <TableCell align="right">{target.shieldRatio}</TableCell>
                          <TableCell align="right">{target.armorRatio}</TableCell>
                          <TableCell align="right">{target.priorityWeight}</TableCell>
                          <TableCell>{target.behaviourChange}</TableCell>
                          <TableCell>{target.isAggressor ? "Yes" : "No"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              ) : (
                <Typography color="text.secondary">No target priority snapshot found.</Typography>
              )}
            </Stack>
          </Paper>
        ) : null}

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
                        <TableCell>
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <TypeIcon
                              iconUrl={item.iconUrl}
                              label={item.itemName}
                              size={24}
                            />
                            <Typography component="span">{item.itemName}</Typography>
                          </Stack>
                        </TableCell>
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

function formatTimestamp(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "Unavailable";
  }

  return new Date(value).toISOString();
}

function formatGateRoute(
  sourceGateName: string | null | undefined,
  sourceGateId: string,
  destinationGateName: string | null | undefined,
  destinationGateId: string,
) {
  return `${sourceGateName ?? formatShortAddress(sourceGateId)} -> ${
    destinationGateName ?? formatShortAddress(destinationGateId)
  }`;
}

function formatPilotLabel(characterId: string | null) {
  return `Pilot ${characterId ? formatShortAddress(characterId) : "Unavailable"}`;
}
