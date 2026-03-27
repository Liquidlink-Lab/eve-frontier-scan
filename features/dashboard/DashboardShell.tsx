"use client";

import type { PropsWithChildren } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";

import { mapDiscoveryToCharacterSummaries } from "@/lib/eve/discovery/eveOwnershipMappers";
import { fetchWalletStructureDiscovery } from "@/lib/eve/discovery/eveOwnershipClient";
import { eveLabelLookups } from "@/lib/eve/lookups";
import { parseWalletAccessSearchParams } from "@/lib/eve/routes";
import DashboardSearchForm from "./DashboardSearchForm";
import Sidebar, { drawerWidth } from "./Sidebar";

interface DashboardShellProps extends PropsWithChildren {
  characterId: string;
}

export default function DashboardShell({
  children,
  characterId,
}: DashboardShellProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDashboardRoute = pathname.startsWith("/dashboard/");
  const access = parseWalletAccessSearchParams(searchParams);

  const discoveryQuery = useQuery({
    queryKey: ["dashboard-shell-discovery", access?.source, access?.walletAddress],
    queryFn: () => fetchWalletStructureDiscovery(access!.walletAddress),
    enabled: isDashboardRoute && access !== null,
    staleTime: 30_000,
  });
  const characters =
    access && discoveryQuery.data
      ? mapDiscoveryToCharacterSummaries(discoveryQuery.data, access, eveLabelLookups)
      : [];

  if (!isDashboardRoute) {
    return <>{children}</>;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(69, 170, 242, 0.1), transparent 30%), #05070b",
      }}
    >
      <Sidebar
        access={access}
        characters={characters}
        currentCharacterId={characterId}
        pathname={pathname}
      />
      <Box
        sx={{
          minHeight: "100vh",
          ml: `${drawerWidth}px`,
        }}
      >
        <Box
          component="header"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1200,
            borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
            backgroundColor: "rgba(5, 7, 11, 0.84)",
            backdropFilter: "blur(18px)",
          }}
        >
          <Box
            sx={{
              px: 3,
              py: 1.5,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <DashboardSearchForm />
          </Box>
        </Box>
        {children}
      </Box>
    </Box>
  );
}
