"use client";

import type { MouseEvent } from "react";
import { useState } from "react";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import {
  Box,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { parseEveWorld, type EveWorld } from "@/lib/eve/env";
import { buildHrefWithWorld, buildMyDashboardHref } from "@/lib/eve/routes";
import WorldSwitcher from "@/features/world/WorldSwitcher";
import { useWalletSession } from "./useWalletSession";

export default function WalletMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const walletSession = useWalletSession();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const currentWorld = parseEveWorld(searchParams.get("world"));

  function handleOpenMenu(event: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleCloseMenu() {
    setAnchorEl(null);
  }

  function handleOpenDashboard() {
    handleCloseMenu();
    router.push(buildMyDashboardHref(currentWorld));
  }

  function handleSwitchWorld(nextWorld: EveWorld) {
    handleCloseMenu();
    router.replace(buildHrefWithWorld(pathname, searchParams, nextWorld));
  }

  function handleDisconnect() {
    handleCloseMenu();
    walletSession.disconnect();
  }

  function handleConnect() {
    handleCloseMenu();

    if (!walletSession.hasEveVault) {
      return;
    }

    walletSession.connect();
  }

  const buttonLabel = walletSession.isConnected && walletSession.shortAddress
    ? walletSession.shortAddress
    : "Connect EVE Vault";

  return (
    <Box
      sx={{
        position: "fixed",
        top: { xs: 12, sm: 16 },
        right: { xs: 12, sm: 16 },
        zIndex: 1400,
      }}
    >
      <>
        <Button
          variant="outlined"
          onClick={handleOpenMenu}
          size="small"
          aria-label={buttonLabel}
          sx={{
            minWidth: { xs: 40, md: "auto" },
            width: { xs: 40, md: "auto" },
            px: { xs: 0, md: 1.5 },
            borderRadius: { xs: "12px", md: undefined },
          }}
        >
          <Box
            component="span"
            sx={{ display: { xs: "inline-flex", md: "none" }, alignItems: "center" }}
          >
            <AccountBalanceWalletRoundedIcon fontSize="small" />
          </Box>
          <Box component="span" sx={{ display: { xs: "none", md: "inline" } }}>
            {buttonLabel}
          </Box>
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <Box sx={{ px: 2, py: 1.5, minWidth: 240 }}>
            <WorldSwitcher value={currentWorld} onChange={handleSwitchWorld} />
          </Box>
          <Divider />
          {walletSession.isConnected ? (
            <>
              <MenuItem onClick={handleOpenDashboard}>
                <ListItemIcon>
                  <DashboardRoundedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>My dashboard</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleDisconnect}>
                <ListItemIcon>
                  <LogoutRoundedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Disconnect</ListItemText>
              </MenuItem>
            </>
          ) : (
            <MenuItem onClick={handleConnect} disabled={!walletSession.hasEveVault}>
              <ListItemIcon>
                <AccountBalanceWalletRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Connect EVE Vault</ListItemText>
            </MenuItem>
          )}
        </Menu>
      </>
    </Box>
  );
}
