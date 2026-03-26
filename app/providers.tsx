"use client";

import { PropsWithChildren, useState } from "react";
import { DAppKitProvider } from "@mysten/dapp-kit-react";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";

import WalletSessionProvider from "@/features/wallet/WalletSessionProvider";
import { dAppKit } from "@/lib/eve/wallet/dappKit";
import { lookupTheme } from "@/theme/theme";

export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lookupTheme}>
        <CssBaseline />
        <DAppKitProvider dAppKit={dAppKit}>
          <WalletSessionProvider>{children}</WalletSessionProvider>
        </DAppKitProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
