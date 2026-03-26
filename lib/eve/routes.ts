export function buildDashboardNetworkNodesHref(
  characterId: string,
  walletAddress: string,
) {
  const searchParams = new URLSearchParams({
    wallet: walletAddress,
  });

  return `/dashboard/${characterId}/network-nodes?${searchParams.toString()}`;
}
