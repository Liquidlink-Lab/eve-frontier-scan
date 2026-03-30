"use client";

import type { PropsWithChildren } from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { Box, IconButton } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";

import { mapDiscoveryToCharacterSummaries } from "@/lib/eve/discovery/eveOwnershipMappers";
import { fetchWalletStructureDiscovery } from "@/lib/eve/discovery/eveOwnershipClient";
import { eveLabelLookups } from "@/lib/eve/lookups";
import { parseWalletAccessSearchParams } from "@/lib/eve/routes";
import DashboardBreadcrumbs from "./DashboardBreadcrumbs";
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        pathname={pathname}
      />
      <Box
        data-testid="dashboard-shell-content"
        sx={{
          minHeight: "100vh",
          ml: { xs: 0, md: `${drawerWidth}px` },
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1200,
          }}
        >
          <Box
            component="header"
            sx={{
              borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
              backgroundColor: "rgba(5, 7, 11, 0.84)",
              backdropFilter: "blur(18px)",
            }}
          >
            <Box
              data-testid="dashboard-header-bar"
              sx={{
                paddingLeft: { xs: 1.5, sm: 3 },
                paddingRight: { xs: 1.5, sm: 3 },
                paddingTop: { xs: 1, sm: 1.25 },
                paddingBottom: { xs: 1, sm: 1.25 },
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  alignItems: "center",
                  columnGap: { xs: 1, sm: 1.5 },
                  gridTemplateColumns: {
                    xs: "40px minmax(0, 1fr) 40px",
                    md: "minmax(0, 1fr)",
                  },
                }}
              >
                <IconButton
                  aria-label="Open dashboard navigation"
                  onClick={() => setMobileSidebarOpen(true)}
                  size="small"
                  sx={{
                    gridColumn: 1,
                    display: { xs: "inline-flex", md: "none" },
                    color: "text.primary",
                    flexShrink: 0,
                    width: 40,
                    height: 40,
                  }}
                >
                  <MenuRoundedIcon />
                </IconButton>
                <Box
                  sx={{
                    gridColumn: { xs: 2, md: 1 },
                    display: "flex",
                    justifyContent: "center",
                    minWidth: 0,
                  }}
                >
                  <DashboardSearchForm />
                </Box>
                <Box
                  aria-hidden="true"
                  sx={{
                    gridColumn: 3,
                    display: { xs: "block", md: "none" },
                  }}
                />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
              backgroundColor: "rgba(8, 11, 17, 0.92)",
              backdropFilter: "blur(18px)",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 1200,
                mx: "auto",
                px: { xs: 2, sm: 3 },
                py: 1.1,
              }}
            >
              <DashboardBreadcrumbs
                access={access}
                characterId={characterId}
                characters={characters}
                discovery={discoveryQuery.data}
                pathname={pathname}
              />
            </Box>
          </Box>
        </Box>
        {children}
      </Box>
    </Box>
  );
}
