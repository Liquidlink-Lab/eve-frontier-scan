"use client";

import type { MouseEvent } from "react";
import { useState } from "react";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import {
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/navigation";

import { useWalletSession } from "./useWalletSession";

export default function WalletMenu() {
  const router = useRouter();
  const walletSession = useWalletSession();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

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
            size="small"
            aria-label={`Open wallet menu for ${walletSession.shortAddress}`}
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
              {walletSession.shortAddress}
            </Box>
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
          size="small"
          aria-label="Connect EVE Vault"
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
            Connect EVE Vault
          </Box>
        </Button>
      )}
    </Box>
  );
}
