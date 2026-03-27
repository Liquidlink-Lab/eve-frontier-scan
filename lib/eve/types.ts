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
  ownerCapId: string | null;
  status: NetworkNodeStatus;
  fuelPercent: number | null;
  fuelEtaMs?: number | null;
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
  systemName: string | null;
  location?: StructureLocation;
  typeId: number | null;
  typeLabel: string;
  typeRepr: string;
  status: NetworkNodeStatus;
}

export interface ConnectedAssemblySummary {
  id: string;
  name: string;
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
  systemName: string | null;
  location?: StructureLocation;
  connectedAssemblyCount: number;
  status: NetworkNodeStatus;
  fuelPercent: number | null;
  fuelEtaMs?: number | null;
  fuelQuantity: number | null;
  connectedAssemblies: ConnectedAssemblySummary[];
}

export interface NetworkNodeDetailSummary extends NetworkNodeSummary {
  connectedAssemblyGroups: ConnectedAssemblyGroup[];
}
