import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import "./globals.css";
import WalletMenu from "@/features/wallet/WalletMenu";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "EVE Frontier Scan",
  description: "Wallet lookup and character dashboard for EVE Frontier.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        <AppRouterCacheProvider>
          <Providers>
            <WalletMenu />
            {children}
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
