import type { ReactNode } from "react";
import {
  Button,
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
  TableContainer,
  Typography,
} from "@mui/material";

import DetailField from "@/features/dashboard/DetailField";
import DashboardRefreshButton from "@/features/dashboard/DashboardRefreshButton";
import TypeIcon from "@/features/icons/TypeIcon";
import LinkText from "@/features/navigation/LinkText";
import { formatShortAddress } from "@/lib/eve/address";
import { calculatePercentage, clampPercentage, formatPercentage } from "@/lib/eve/percent";
import {
  buildDashboardAssemblyDetailHref,
  buildDashboardNetworkNodesHref,
  buildDashboardNetworkNodeDetailHref,
} from "@/lib/eve/routes";
import { getSuiscanObjectUrl, getSuiscanTransactionUrl } from "@/lib/eve/suiscan";
import type {
  AssemblyDetailSummary,
  GateJumpSummary,
  GatePermitSummary,
  StorageInventoryActivitySummary,
  StorageInventoriesSummary,
  StorageInventorySummary,
  WalletAccessContext,
} from "@/lib/eve/types";

interface AssemblyDetailPageProps {
  access?: WalletAccessContext;
  characterId?: string;
  characterName: string;
  assembly: AssemblyDetailSummary;
  storageInventory?: StorageInventorySummary | null;
  storageInventories?: StorageInventoriesSummary | null;
}

export default function AssemblyDetailPage({
  access,
  characterId,
  characterName,
  assembly,
  storageInventory,
  storageInventories,
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
  const linkedGateHref =
    access && characterId && assembly.linkedGateId
      ? buildDashboardAssemblyDetailHref(characterId, assembly.linkedGateId, access)
      : null;

  return (
    <main>
      <Stack
        spacing={3}
        sx={{ maxWidth: 960, mx: "auto", px: { xs: 2, sm: 3 }, py: { xs: 4, md: 6 } }}
      >
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

        <Paper elevation={0} sx={{ px: { xs: 2.5, sm: 3 }, py: 3 }}>
          <Stack spacing={2}>
            <DetailField label="Type">
              <Typography>{assembly.typeLabel}</Typography>
            </DetailField>
            <DetailField label="Solar system">
              <Typography>{assembly.systemName ?? "Unknown"}</Typography>
            </DetailField>
            <DetailField label="Coordinates">
              <Typography>
                {assembly.location
                  ? `${assembly.location.x}, ${assembly.location.y}, ${assembly.location.z}`
                  : "Unavailable"}
              </Typography>
            </DetailField>
            <DetailField label="Status">
              <Chip
                label={assembly.status}
                color={assembly.status === "online" ? "success" : "default"}
                size="small"
                variant="outlined"
              />
            </DetailField>
            {assembly.description ? (
              <DetailField label="Description" alignTop>
                <Typography>{assembly.description}</Typography>
              </DetailField>
            ) : null}
            {assembly.url ? (
              <DetailField label="Reference URL" alignTop>
                <MuiLink href={assembly.url} underline="hover" target="_blank" rel="noreferrer">
                  {assembly.url}
                </MuiLink>
              </DetailField>
            ) : null}
            {assembly.energySourceId ? (
              <DetailField label="Powered by">
                {energySourceHref ? (
                  <LinkText href={energySourceHref} underline="hover">
                    {assembly.energySourceName ?? formatShortAddress(assembly.energySourceId)}
                  </LinkText>
                ) : (
                  <Typography>
                    {assembly.energySourceName ?? formatShortAddress(assembly.energySourceId)}
                  </Typography>
                )}
              </DetailField>
            ) : null}
            {(assembly.extensionType || assembly.extensionLabel) ? (
              <DetailField label="Extension" alignTop>
                <Stack
                  spacing={0.5}
                  sx={{ alignItems: { xs: "flex-start", sm: "flex-end" } }}
                >
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
              </DetailField>
            ) : null}
            {assembly.extensionFrozen !== null ? (
              <DetailField label="Extension frozen">
                <Typography>{assembly.extensionFrozen ? "Yes" : "No"}</Typography>
              </DetailField>
            ) : null}
            {assembly.linkedGateId ? (
              <DetailField label="Linked gate">
                {linkedGateHref ? (
                  <LinkText href={linkedGateHref} underline="hover">
                    {assembly.linkedGateName ?? formatShortAddress(assembly.linkedGateId)}
                  </LinkText>
                ) : (
                  <Typography>
                    {assembly.linkedGateName ?? formatShortAddress(assembly.linkedGateId)}
                  </Typography>
                )}
              </DetailField>
            ) : null}
            {assembly.gateAccessMode ? (
              <DetailField label="Access mode">
                <Typography>{assembly.gateAccessMode}</Typography>
              </DetailField>
            ) : null}
          </Stack>
        </Paper>

        {assembly.typeRepr.includes("::gate::Gate") ? (
          <Paper elevation={0} sx={{ px: { xs: 2.5, sm: 3 }, py: 3 }}>
            <Stack spacing={2}>
              <Typography component="h2" variant="h4">
                Gate operations
              </Typography>
              <Stack spacing={1.25}>
                <Typography color="text.secondary">Recent jumps</Typography>
                {(assembly.recentJumps ?? []).length === 0 ? (
                  <Typography color="text.secondary">No recent jumps found.</Typography>
                ) : (
                  (assembly.recentJumps ?? []).map((jump) => (
                    <EventActivityCard
                      key={jump.txDigest}
                      href={getSuiscanTransactionUrl(jump.txDigest)}
                      buttonAriaLabel="View jump event on SuiScan"
                      timestamp={formatTimestamp(jump.timestampMs)}
                      route={
                        <GateEventRoute
                          access={access}
                          characterId={characterId}
                          sourceGateId={jump.sourceGateId}
                          sourceGateName={jump.sourceGateName}
                          destinationGateId={jump.destinationGateId}
                          destinationGateName={jump.destinationGateName}
                        />
                      }
                      metadata={
                        <PilotDashboardLink
                          characterId={jump.characterId}
                          characterName={jump.characterName}
                          characterWalletAddress={jump.characterWalletAddress}
                        />
                      }
                    />
                  ))
                )}
              </Stack>
              <Stack spacing={1.25}>
                <Typography color="text.secondary">Recent permits</Typography>
                {(assembly.recentPermits ?? []).length === 0 ? (
                  <Typography color="text.secondary">No recent permits found.</Typography>
                ) : (
                  (assembly.recentPermits ?? []).map((permit) => (
                    <EventActivityCard
                      key={permit.txDigest}
                      href={getSuiscanTransactionUrl(permit.txDigest)}
                      buttonAriaLabel="View permit event on SuiScan"
                      timestamp={formatTimestamp(permit.expiresAtMs)}
                      route={
                        <GateEventRoute
                          access={access}
                          characterId={characterId}
                          sourceGateId={permit.sourceGateId}
                          sourceGateName={permit.sourceGateName}
                          destinationGateId={permit.destinationGateId}
                          destinationGateName={permit.destinationGateName}
                        />
                      }
                      metadata={
                        <Stack spacing={0.25}>
                          <Typography>{`Permit ${permit.jumpPermitId}`}</Typography>
                          <PilotDashboardLink
                            characterId={permit.characterId}
                            characterName={permit.characterName}
                            characterWalletAddress={permit.characterWalletAddress}
                          />
                        </Stack>
                      }
                    />
                  ))
                )}
              </Stack>
            </Stack>
          </Paper>
        ) : null}

        {assembly.typeRepr.includes("::turret::Turret") ? (
          <Paper elevation={0} sx={{ px: { xs: 2.5, sm: 3 }, py: 3 }}>
            <Stack spacing={2}>
              <Typography component="h2" variant="h4">
                Latest target priority snapshot
              </Typography>
              {assembly.latestTurretPrioritySnapshot ? (
                <>
                  <DetailField label="Updated at">
                    <Typography>
                      {formatTimestamp(assembly.latestTurretPrioritySnapshot.updatedAtMs)}
                    </Typography>
                  </DetailField>
                  <TableContainer sx={{ overflowX: "auto" }}>
                    <Table size="small" sx={{ minWidth: 960 }}>
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
                  </TableContainer>
                </>
              ) : (
                <Typography color="text.secondary">No target priority snapshot found.</Typography>
              )}
            </Stack>
          </Paper>
        ) : null}

        {storageInventories ? (
          <>
            <StorageInventorySection
              inventory={storageInventories.ownerInventory}
              heading="Owner inventory"
            />
            <StorageInventorySection
              inventory={storageInventories.openStorageInventory}
              heading="Open storage"
            />
            {storageInventories.playerOwnedInventories.map((playerInventory) => (
              <StorageInventorySection
                key={playerInventory.ownerCapId}
                inventory={playerInventory.inventory}
                heading={getPlayerInventoryHeading(playerInventory)}
                metadata={
                  playerInventory.characterId ? (
                    <PilotDashboardLink
                      characterId={playerInventory.characterId}
                      characterName={playerInventory.characterName}
                      characterWalletAddress={playerInventory.characterWalletAddress}
                    />
                  ) : undefined
                }
              />
            ))}
          </>
        ) : null}

        {storageInventory ? (
          <Paper elevation={0} sx={{ px: { xs: 2.5, sm: 3 }, py: 3 }}>
            <Stack spacing={2}>
              <Typography component="h2" variant="h4">
                Inventory
              </Typography>
              <Stack spacing={0.75}>
                <DetailField label="Capacity used">
                  <Typography>{formatPercentage(storageCapacityPercent)}</Typography>
                </DetailField>
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
                <TableContainer sx={{ overflowX: "auto" }}>
                  <Table size="small" sx={{ minWidth: 760 }}>
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
                </TableContainer>
              )}
            </Stack>
          </Paper>
        ) : null}

        {assembly.typeRepr.includes("::storage_unit::StorageUnit") ? (
          <Paper elevation={0} sx={{ px: { xs: 2.5, sm: 3 }, py: 3 }}>
            <Stack spacing={2}>
              <Typography component="h2" variant="h4">
                Recent inventory activity
              </Typography>
              {(assembly.recentInventoryActivity ?? []).length === 0 ? (
                <Typography color="text.secondary">
                  No recent inventory activity found.
                </Typography>
              ) : (
                (assembly.recentInventoryActivity ?? []).map((activity) => (
                  <EventActivityCard
                    key={`${activity.txDigest}:${activity.action}:${activity.itemId}`}
                    href={getSuiscanTransactionUrl(activity.txDigest)}
                    buttonAriaLabel="View inventory event on SuiScan"
                    timestamp={formatTimestamp(activity.timestampMs)}
                    route={<StorageInventoryActivityRoute activity={activity} />}
                    metadata={
                      activity.characterId ? (
                        <PilotDashboardLink
                          characterId={activity.characterId}
                          characterName={activity.characterName}
                          characterWalletAddress={activity.characterWalletAddress}
                        />
                      ) : undefined
                    }
                  />
                ))
              )}
            </Stack>
          </Paper>
        ) : null}
      </Stack>
    </main>
  );
}

function StorageInventorySection({
  heading,
  inventory,
  metadata,
}: {
  heading: string;
  inventory: StorageInventorySummary;
  metadata?: ReactNode;
}) {
  const capacityPercent = calculatePercentage(
    inventory.usedCapacity,
    inventory.maxCapacity,
  );

  return (
    <Paper elevation={0} sx={{ px: { xs: 2.5, sm: 3 }, py: 3 }}>
      <Stack spacing={2}>
        <Typography component="h2" variant="h4">
          {heading}
        </Typography>
        {metadata ?? null}
        <Stack spacing={0.75}>
          <DetailField label="Capacity used">
            <Typography>{formatPercentage(capacityPercent)}</Typography>
          </DetailField>
          {capacityPercent !== null ? (
            <LinearProgress
              aria-label={`${heading} capacity usage`}
              variant="determinate"
              value={clampPercentage(capacityPercent)}
              sx={{ height: 8, borderRadius: 999 }}
            />
          ) : null}
          <Typography variant="body2" color="text.secondary">
            {inventory.usedCapacity === null || inventory.maxCapacity === null
              ? "Capacity unavailable"
              : `${inventory.usedCapacity} / ${inventory.maxCapacity} used`}
          </Typography>
        </Stack>
        {inventory.items.length === 0 ? (
          <Typography color="text.secondary">No inventory items found.</Typography>
        ) : (
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: 760 }}>
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
                {inventory.items.map((item) => (
                  <TableRow key={`${heading}:${item.typeId}:${item.itemId}`}>
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
          </TableContainer>
        )}
      </Stack>
    </Paper>
  );
}

function formatTimestamp(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "Unavailable";
  }

  const date = new Date(value);
  const month = MONTH_LABELS[date.getUTCMonth()] ?? "Unknown";
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const hours = padTimestampSegment(date.getUTCHours());
  const minutes = padTimestampSegment(date.getUTCMinutes());

  return `${month} ${day}, ${year}, ${hours}:${minutes} UTC`;
}

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function padTimestampSegment(value: number) {
  return String(value).padStart(2, "0");
}

function EventActivityCard({
  href,
  buttonAriaLabel,
  timestamp,
  route,
  metadata,
}: {
  href: string;
  buttonAriaLabel: string;
  timestamp: string;
  route: ReactNode;
  metadata?: ReactNode;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        px: 2,
        py: 1.75,
        border: "1px solid rgba(148, 163, 184, 0.12)",
        backgroundColor: "rgba(11, 18, 32, 0.72)",
      }}
    >
      <Stack spacing={1.25}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
        >
          <Typography variant="body2" color="text.secondary">
            {timestamp}
          </Typography>
          <Button
            href={href}
            target="_blank"
            rel="noreferrer"
            variant="outlined"
            color="inherit"
            size="small"
            aria-label={buttonAriaLabel}
            sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
          >
            View on SuiScan
          </Button>
        </Stack>
        <Typography component="div" sx={{ fontWeight: 500 }}>
          {route}
        </Typography>
        {metadata ?? null}
      </Stack>
    </Paper>
  );
}

function GateEventRoute({
  access,
  characterId,
  sourceGateId,
  sourceGateName,
  destinationGateId,
  destinationGateName,
}: {
  access?: WalletAccessContext;
  characterId?: string;
  sourceGateId: GateJumpSummary["sourceGateId"] | GatePermitSummary["sourceGateId"];
  sourceGateName: string | null | undefined;
  destinationGateId: GateJumpSummary["destinationGateId"] | GatePermitSummary["destinationGateId"];
  destinationGateName: string | null | undefined;
}) {
  return (
    <Typography component="div">
      <AssemblyRouteLink
        access={access}
        characterId={characterId}
        assemblyId={sourceGateId}
        label={sourceGateName ?? formatShortAddress(sourceGateId)}
      />
      {" -> "}
      <AssemblyRouteLink
        access={access}
        characterId={characterId}
        assemblyId={destinationGateId}
        label={destinationGateName ?? formatShortAddress(destinationGateId)}
      />
    </Typography>
  );
}

function StorageInventoryActivityRoute({
  activity,
}: {
  activity: StorageInventoryActivitySummary;
}) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="center">
      <TypeIcon
        iconUrl={activity.iconUrl}
        label={activity.itemName}
        size={24}
      />
      <Typography component="span" sx={{ fontWeight: 500 }}>
        {formatStorageInventoryActivityLabel(activity)}
      </Typography>
    </Stack>
  );
}

function AssemblyRouteLink({
  access,
  characterId,
  assemblyId,
  label,
}: {
  access?: WalletAccessContext;
  characterId?: string;
  assemblyId: string;
  label: string;
}) {
  const href =
    access && characterId
      ? buildDashboardAssemblyDetailHref(characterId, assemblyId, access)
      : null;

  if (!href) {
    return <>{label}</>;
  }

  return (
    <LinkText href={href} underline="hover">
      {label}
    </LinkText>
  );
}

function formatPilotLabel(characterId: string | null) {
  return `Pilot ${characterId ? formatShortAddress(characterId) : "Unavailable"}`;
}

function getPlayerInventoryHeading(
  playerInventory: NonNullable<AssemblyDetailPageProps["storageInventories"]>["playerOwnedInventories"][number],
) {
  return `Player inventory · ${
    playerInventory.characterName ??
    (playerInventory.characterId
      ? formatShortAddress(playerInventory.characterId)
      : formatShortAddress(playerInventory.ownerCapId))
  }`;
}

function formatStorageInventoryActivityLabel(
  activity: StorageInventoryActivitySummary,
) {
  return `${getStorageInventoryActionLabel(activity.action)} ${activity.quantity}x ${activity.itemName}`;
}

function getStorageInventoryActionLabel(action: StorageInventoryActivitySummary["action"]) {
  switch (action) {
    case "minted":
      return "Minted";
    case "burned":
      return "Burned";
    case "deposited":
      return "Deposited";
    case "withdrawn":
      return "Withdrew";
    case "destroyed":
      return "Destroyed";
    default:
      return "Updated";
  }
}

function PilotDashboardLink({
  characterId,
  characterName,
  characterWalletAddress,
}: {
  characterId: string | null;
  characterName?: string | null;
  characterWalletAddress?: string | null;
}) {
  if (characterId && characterName && characterWalletAddress) {
    return (
      <LinkText
        href={buildDashboardNetworkNodesHref(characterId, {
          walletAddress: characterWalletAddress,
          source: "sui-address",
        })}
        underline="hover"
        variant="body2"
      >
        {`Pilot ${characterName}`}
      </LinkText>
    );
  }

  return (
    <Typography variant="body2" color="text.secondary">
      {formatPilotLabel(characterId)}
    </Typography>
  );
}
