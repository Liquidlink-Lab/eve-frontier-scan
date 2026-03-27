"use client";

import type { PropsWithChildren } from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
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
  const theme = useTheme();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDashboardRoute = pathname.startsWith("/dashboard/");
  const isDesktopNavigation = useMediaQuery(theme.breakpoints.up("md"), {
    noSsr: true,
  });
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
        isDesktopNavigation={isDesktopNavigation}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        pathname={pathname}
      />
      <Box
        data-testid="dashboard-shell-content"
        sx={{
          minHeight: "100vh",
          ml: isDesktopNavigation ? `${drawerWidth}px` : 0,
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
              style={!isDesktopNavigation ? { paddingRight: "64px" } : undefined}
              sx={{
                paddingLeft: { xs: 1.5, sm: 3 },
                paddingRight: { xs: "64px", md: 3 },
                paddingTop: { xs: 1, sm: 1.25 },
                paddingBottom: { xs: 1, sm: 1.25 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1, sm: 1.5 },
                }}
              >
                <IconButton
                  aria-label="Open dashboard navigation"
                  onClick={() => setMobileSidebarOpen(true)}
                  size="small"
                  sx={{
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
                    display: "flex",
                    justifyContent: "center",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <DashboardSearchForm />
                </Box>
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
