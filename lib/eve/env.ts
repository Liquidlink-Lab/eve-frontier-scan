export interface EveEnv {
  worldApiUrl: string;
  eveWorldPackageId: string;
  suiGraphQlEndpoint: string;
  suiRpcEndpoint: string;
}

const DEFAULT_WORLD_API_URL = "https://world-api-utopia.uat.pub.evefrontier.com";
const DEFAULT_SUI_GRAPHQL_ENDPOINT = "https://graphql.testnet.sui.io/graphql";
const DEFAULT_SUI_RPC_ENDPOINT = "https://fullnode.testnet.sui.io:443";
const DEFAULT_EVE_WORLD_PACKAGE_ID =
  "0xd12a70c74c1e759445d6f209b01d43d860e97fcf2ef72ccbbd00afd828043f75";

export const eveEnv: EveEnv = {
  worldApiUrl: process.env.NEXT_PUBLIC_WORLD_API_URL ?? DEFAULT_WORLD_API_URL,
  eveWorldPackageId:
    process.env.NEXT_PUBLIC_EVE_WORLD_PACKAGE_ID ?? DEFAULT_EVE_WORLD_PACKAGE_ID,
  suiGraphQlEndpoint:
    process.env.NEXT_PUBLIC_SUI_GRAPHQL_ENDPOINT ?? DEFAULT_SUI_GRAPHQL_ENDPOINT,
  suiRpcEndpoint: process.env.NEXT_PUBLIC_SUI_RPC_ENDPOINT ?? DEFAULT_SUI_RPC_ENDPOINT,
};
