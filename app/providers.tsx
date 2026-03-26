"use client";

import { PropsWithChildren, useState, useSyncExternalStore } from "react";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";
import dynamic from "next/dynamic";

import { lookupTheme } from "@/theme/theme";

const WalletRuntimeProvider = dynamic(
  () => import("@/features/wallet/WalletRuntimeProvider"),
  { ssr: false },
);

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
  const walletRuntimeReady = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lookupTheme}>
        <CssBaseline />
        {walletRuntimeReady ? (
          <WalletRuntimeProvider>{children}</WalletRuntimeProvider>
        ) : (
          children
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
