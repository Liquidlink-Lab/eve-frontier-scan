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
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
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
        top: 16,
        right: 16,
        zIndex: 1400,
      }}
    >
      {walletSession.isConnected && walletSession.shortAddress ? (
        <>
          <Button variant="outlined" onClick={handleOpenMenu}>
            {walletSession.shortAddress}
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
        >
          Connect EVE Vault
        </Button>
      )}
    </Box>
  );
}
