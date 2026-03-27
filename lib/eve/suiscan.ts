const SUISCAN_TESTNET_BASE_URL = "https://suiscan.xyz/testnet";

export function getSuiscanAddressUrl(address: string) {
  return `${SUISCAN_TESTNET_BASE_URL}/account/${address}`;
}

export function getSuiscanObjectUrl(objectId: string) {
  return `${SUISCAN_TESTNET_BASE_URL}/object/${objectId}`;
}

export function getSuiscanTransactionUrl(txDigest: string) {
  return `${SUISCAN_TESTNET_BASE_URL}/tx/${txDigest}`;
}
