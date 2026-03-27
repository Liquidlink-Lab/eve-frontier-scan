"use client";

import type { MouseEvent } from "react";
import { useState } from "react";
import {
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useRouter } from "next/navigation";

import { useWalletSession } from "./useWalletSession";

export default function WalletMenu() {
  const theme = useTheme();
  const router = useRouter();
  const walletSession = useWalletSession();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isCompactMobile = useMediaQuery(theme.breakpoints.down("md"), {
    noSsr: true,
  });

  function handleOpenMenu(event: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleCloseMenu() {
    setAnchorEl(null);
  }

  function handleOpenDashboard() {
    handleCloseMenu();
    router.push("/me");
  }

  function handleDisconnect() {
    handleCloseMenu();
    walletSession.disconnect();
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: { xs: 12, sm: 16 },
        right: { xs: 12, sm: 16 },
        zIndex: 1400,
      }}
    >
      {walletSession.isConnected && walletSession.shortAddress ? (
        <>
          <Button
            variant="outlined"
            onClick={handleOpenMenu}
            size={isCompactMobile ? "small" : "medium"}
            aria-label={
              isCompactMobile
                ? `Open wallet menu for ${walletSession.shortAddress}`
                : undefined
            }
            sx={{
              minWidth: isCompactMobile ? 40 : undefined,
              width: isCompactMobile ? 40 : "auto",
              px: isCompactMobile ? 0 : undefined,
              borderRadius: isCompactMobile ? "12px" : undefined,
            }}
          >
            {isCompactMobile ? (
              <AccountBalanceWalletRoundedIcon fontSize="small" />
            ) : (
              walletSession.shortAddress
            )}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
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
          </Menu>
        </>
      ) : (
        <Button
          variant="outlined"
          onClick={walletSession.connect}
          disabled={!walletSession.hasEveVault}
          size={isCompactMobile ? "small" : "medium"}
          aria-label={isCompactMobile ? "Connect EVE Vault" : undefined}
          sx={{
            minWidth: isCompactMobile ? 40 : undefined,
            width: isCompactMobile ? 40 : "auto",
            px: isCompactMobile ? 0 : undefined,
            borderRadius: isCompactMobile ? "12px" : undefined,
          }}
        >
          {isCompactMobile ? (
            <AccountBalanceWalletRoundedIcon fontSize="small" />
          ) : (
            "Connect EVE Vault"
          )}
        </Button>
      )}
    </Box>
  );
}
