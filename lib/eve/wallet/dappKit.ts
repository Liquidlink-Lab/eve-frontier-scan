import { createDAppKit } from "@mysten/dapp-kit-react";
import { SuiGrpcClient } from "@mysten/sui/grpc";

const GRPC_URLS = {
  testnet: "https://fullnode.testnet.sui.io:443",
  devnet: "https://fullnode.devnet.sui.io:443",
} as const;

type SupportedNetwork = keyof typeof GRPC_URLS;
const supportedNetworks = Object.keys(GRPC_URLS) as SupportedNetwork[];

export const dAppKit = createDAppKit({
  networks: supportedNetworks,
  createClient(network) {
    return new SuiGrpcClient({
      network,
      baseUrl: GRPC_URLS[network],
    });
  },
});

declare module "@mysten/dapp-kit-react" {
  interface Register {
    dAppKit: typeof dAppKit;
  }
}
