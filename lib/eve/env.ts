export interface EveEnv {
  worldApiUrl: string;
  eveWorldPackageId: string;
  suiGraphQlEndpoint: string;
  suiRpcEndpoint: string;
}

export type EveWorld = "utopia" | "stillness";

export interface EveWorldConfig extends EveEnv {
  id: EveWorld;
  label: string;
}

const DEFAULT_UTOPIA_WORLD_API_URL = "https://world-api-utopia.uat.pub.evefrontier.com";
const DEFAULT_STILLNESS_WORLD_API_URL =
  "https://world-api-stillness.uat.pub.evefrontier.com";
const DEFAULT_SUI_GRAPHQL_ENDPOINT = "https://graphql.testnet.sui.io/graphql";
const DEFAULT_SUI_RPC_ENDPOINT = "https://fullnode.testnet.sui.io:443";
const DEFAULT_UTOPIA_EVE_WORLD_PACKAGE_ID =
  "0xd12a70c74c1e759445d6f209b01d43d860e97fcf2ef72ccbbd00afd828043f75";
const DEFAULT_STILLNESS_EVE_WORLD_PACKAGE_ID =
  "0x28b497559d65ab320d9da4613bf2498d5946b2c0ae3597ccfda3072ce127448c";

export const defaultEveWorld: EveWorld = "utopia";

const suiGraphQlEndpoint =
  process.env.NEXT_PUBLIC_SUI_GRAPHQL_ENDPOINT ?? DEFAULT_SUI_GRAPHQL_ENDPOINT;
const suiRpcEndpoint =
  process.env.NEXT_PUBLIC_SUI_RPC_ENDPOINT ?? DEFAULT_SUI_RPC_ENDPOINT;

const eveWorldConfigs: Record<EveWorld, EveWorldConfig> = {
  utopia: {
    id: "utopia",
    label: "Utopia",
    worldApiUrl: process.env.NEXT_PUBLIC_WORLD_API_URL ?? DEFAULT_UTOPIA_WORLD_API_URL,
    eveWorldPackageId:
      process.env.NEXT_PUBLIC_EVE_WORLD_PACKAGE_ID ?? DEFAULT_UTOPIA_EVE_WORLD_PACKAGE_ID,
    suiGraphQlEndpoint,
    suiRpcEndpoint,
  },
  stillness: {
    id: "stillness",
    label: "Stillness",
    worldApiUrl: DEFAULT_STILLNESS_WORLD_API_URL,
    eveWorldPackageId: DEFAULT_STILLNESS_EVE_WORLD_PACKAGE_ID,
    suiGraphQlEndpoint,
    suiRpcEndpoint,
  },
};

export const eveWorldOptions = Object.values(eveWorldConfigs);

export function isEveWorld(value: string | null | undefined): value is EveWorld {
  return value === "utopia" || value === "stillness";
}

export function parseEveWorld(value: string | null | undefined): EveWorld {
  return isEveWorld(value) ? value : defaultEveWorld;
}

export function getEveWorldConfig(world = defaultEveWorld) {
  return eveWorldConfigs[world];
}

export const eveEnv: EveEnv = {
  ...getEveWorldConfig(defaultEveWorld),
};
