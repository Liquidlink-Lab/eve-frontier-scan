export type WalletSource = "eve-vault" | "sui-address";

export interface WalletAccessContext {
  source: WalletSource;
  walletAddress: string;
}

export type NetworkNodeStatus = "online" | "offline" | "unknown";

export interface StructureLocation {
  solarSystemId: number;
  x: string;
  y: string;
  z: string;
}

export interface DiscoveredCharacter {
  id: string;
  name: string;
  tribeId: number | null;
  ownerCapId: string | null;
}

export interface DiscoveredStructure {
  id: string;
  typeId: number | null;
  typeLabel: string;
  typeRepr: string;
  name: string;
  description?: string | null;
  url?: string | null;
  itemId?: number | null;
  tenant?: string | null;
  ownerCapId: string | null;
  energySourceId?: string | null;
  linkedGateId?: string | null;
  extensionType?: string | null;
  status: NetworkNodeStatus;
  fuelPercent: number | null;
  fuelEtaMs?: number | null;
  fuelTypeId?: number | null;
  fuelQuantity: number | null;
  location?: StructureLocation;
  connectedAssemblyIds: string[];
}

export interface CharacterStructureDiscovery {
  characterId: string;
  character: DiscoveredCharacter | null;
  playerProfileIds: string[];
  ownedStructures: DiscoveredStructure[];
  relatedStructures?: DiscoveredStructure[];
}

export interface WalletStructureDiscovery {
  walletAddress: string;
  characters: CharacterStructureDiscovery[];
}

export interface LabelLookups {
  tribeNames: Map<number, string>;
  typeNames: Map<number, string>;
  typeIcons?: Map<number, string>;
}

export interface WorldTypeRecord {
  id: number;
  name: string;
  groupName?: string;
  categoryName?: string;
  iconUrl?: string;
}

export interface CharacterSummary {
  id: string;
  name: string;
  tribeName: string;
  walletAddress: string;
  walletSource: WalletSource;
  walletSourceLabel: string;
  networkNodeCount: number;
  currentShipName: string | null;
}

export interface AssemblySummary {
  id: string;
  name: string;
  iconUrl?: string | null;
  systemName: string | null;
  location?: StructureLocation;
  typeId: number | null;
  typeLabel: string;
  typeRepr: string;
  status: NetworkNodeStatus;
}

export interface AssemblyDetailSummary extends AssemblySummary {
  description: string | null;
  url: string | null;
  itemId: number | null;
  tenant: string | null;
  ownerCapId: string | null;
  energySourceId: string | null;
  energySourceName: string | null;
  linkedGateId: string | null;
  linkedGateName: string | null;
  extensionType: string | null;
  extensionLabel: string;
  extensionFrozen: boolean | null;
  gateAccessMode: string | null;
  gateMaxLinkDistance?: number | null;
  recentJumps?: GateJumpSummary[];
  recentPermits?: GatePermitSummary[];
  latestTurretPrioritySnapshot?: TurretPrioritySnapshotSummary | null;
  recentInventoryActivity?: StorageInventoryActivitySummary[];
}

export interface GateJumpSummary {
  txDigest: string;
  timestampMs: number;
  sourceGateId: string;
  sourceGateItemId: number | null;
  sourceGateName?: string | null;
  destinationGateId: string;
  destinationGateItemId: number | null;
  destinationGateName?: string | null;
  characterId: string | null;
  characterItemId: number | null;
  characterName?: string | null;
  characterWalletAddress?: string | null;
}

export interface GatePermitSummary {
  txDigest: string;
  jumpPermitId: string;
  sourceGateId: string;
  sourceGateItemId: number | null;
  sourceGateName?: string | null;
  destinationGateId: string;
  destinationGateItemId: number | null;
  destinationGateName?: string | null;
  characterId: string | null;
  characterItemId: number | null;
  characterName?: string | null;
  characterWalletAddress?: string | null;
  expiresAtMs: number | null;
  extensionType: string | null;
  timestampMs: number;
}

export interface TurretPriorityTargetSummary {
  itemId: number;
  typeId: number;
  groupId: number;
  characterId: number;
  characterTribe: number;
  hpRatio: number;
  shieldRatio: number;
  armorRatio: number;
  isAggressor: boolean;
  priorityWeight: number;
  behaviourChange: string;
}

export interface TurretPrioritySnapshotSummary {
  txDigest: string;
  updatedAtMs: number;
  targets: TurretPriorityTargetSummary[];
}

export interface StorageInventoryItemSummary {
  itemId: number;
  itemName: string;
  iconUrl?: string | null;
  quantity: number;
  typeId: number;
  volume: number;
}

export interface StorageInventorySummary {
  maxCapacity: number | null;
  usedCapacity: number | null;
  items: StorageInventoryItemSummary[];
}

export interface StoragePlayerInventorySummary {
  ownerCapId: string;
  characterId?: string | null;
  characterName?: string | null;
  characterWalletAddress?: string | null;
  inventory: StorageInventorySummary;
}

export interface StorageInventoriesSummary {
  ownerInventory: StorageInventorySummary;
  openStorageInventory: StorageInventorySummary;
  playerOwnedInventories: StoragePlayerInventorySummary[];
}

export type StorageInventoryActivityAction =
  | "minted"
  | "burned"
  | "deposited"
  | "withdrawn"
  | "destroyed";

export interface StorageInventoryActivitySummary {
  txDigest: string;
  timestampMs: number;
  action: StorageInventoryActivityAction;
  itemId: number;
  itemName: string;
  iconUrl?: string | null;
  quantity: number;
  typeId: number;
  characterId: string | null;
  characterItemId: number | null;
  characterName?: string | null;
  characterWalletAddress?: string | null;
}

export interface ConnectedAssemblySummary {
  id: string;
  name: string;
  iconUrl?: string | null;
  typeLabel: string;
  status: NetworkNodeStatus;
}

export interface ConnectedAssemblyGroup {
  label: string;
  assemblies: ConnectedAssemblySummary[];
}

export interface NetworkNodeSummary {
  id: string;
  name: string;
  iconUrl?: string | null;
  systemName: string | null;
  location?: StructureLocation;
  connectedAssemblyCount: number;
  status: NetworkNodeStatus;
  fuelPercent: number | null;
  fuelEtaMs?: number | null;
  fuelTypeId?: number | null;
  fuelTypeName?: string | null;
  fuelTypeIconUrl?: string | null;
  fuelQuantity: number | null;
  connectedAssemblies: ConnectedAssemblySummary[];
}

export interface NetworkNodeDetailSummary extends NetworkNodeSummary {
  connectedAssemblyGroups: ConnectedAssemblyGroup[];
}
