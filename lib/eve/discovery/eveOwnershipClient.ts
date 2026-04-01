import { defaultEveWorld, getEveWorldConfig, type EveWorld } from "../env";
import { discoverOwnedStructures } from "./assemblyDiscovery";

export async function requestOwnershipGraphQl(
  query: string,
  variables: Record<string, unknown>,
  endpoint = getEveWorldConfig(defaultEveWorld).suiGraphQlEndpoint,
) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed with status ${response.status}`);
  }

  return response.json() as Promise<unknown>;
}

export function createOwnershipGraphQlClient(
  endpoint = getEveWorldConfig(defaultEveWorld).suiGraphQlEndpoint,
) {
  return (query: string, variables: Record<string, unknown>) =>
    requestOwnershipGraphQl(query, variables, endpoint);
}

export async function fetchWalletStructureDiscovery(
  walletAddress: string,
  world = defaultEveWorld as EveWorld,
) {
  const eveEnv = getEveWorldConfig(world);

  return discoverOwnedStructures({
    walletAddress,
    packageId: eveEnv.eveWorldPackageId,
    graphQl: createOwnershipGraphQlClient(eveEnv.suiGraphQlEndpoint),
  });
}
