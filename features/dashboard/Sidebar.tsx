"use client";

import Link from "next/link";
import {
  Box,
  Divider,
  Drawer,
  Link as MuiLink,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import CharacterSwitcher from "./CharacterSwitcher";
import { formatShortAddress } from "@/lib/eve/address";
import { buildDashboardNetworkNodesHref, getWalletSourceLabel } from "@/lib/eve/routes";
import { getSuiscanAddressUrl } from "@/lib/eve/suiscan";
import type { CharacterSummary, WalletAccessContext } from "@/lib/eve/types";

const drawerWidth = 296;

interface SidebarProps {
  access: WalletAccessContext | null;
  characters: CharacterSummary[];
  currentCharacterId: string;
  pathname: string;
}

export default function Sidebar({
  access,
  characters,
  currentCharacterId,
  pathname,
}: SidebarProps) {
  const currentCharacter =
    characters.find((character) => character.id === currentCharacterId) ?? null;

  return (
    <Drawer
      variant="permanent"
      open
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid rgba(148, 163, 184, 0.18)",
          backgroundColor: "rgba(8, 11, 17, 0.96)",
          backgroundImage:
            "linear-gradient(180deg, rgba(69, 170, 242, 0.08), rgba(8, 11, 17, 0))",
          color: "text.primary",
          px: 2.5,
          py: 3,
        },
      }}
    >
      <Stack spacing={2.5} sx={{ height: "100%" }}>
        <div>
          <Typography
            component="p"
            sx={{
              fontSize: "0.72rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "text.secondary",
              mb: 0.75,
            }}
          >
            {access ? getWalletSourceLabel(access.source) : "Dashboard"}
          </Typography>
          {access ? (
            <MuiLink
              component={Link}
              href={getSuiscanAddressUrl(access.walletAddress)}
              underline="hover"
              target="_blank"
              rel="noreferrer"
              color="inherit"
            >
              {formatShortAddress(access.walletAddress)}
            </MuiLink>
          ) : (
            <Typography color="text.secondary">
              Open this page from a wallet lookup to restore context.
            </Typography>
          )}
        </div>

        <CharacterSwitcher
          access={access}
          characters={characters}
          currentCharacterId={currentCharacterId}
        />

        <Divider />

        {currentCharacter ? (
          <Box>
            <Typography variant="h5">{currentCharacter.name}</Typography>
            <Typography color="text.secondary">{currentCharacter.tribeName}</Typography>
          </Box>
        ) : null}

        <Box component="nav" aria-label="Dashboard navigation">
          <List disablePadding>
            <ListItemButton
              component={Link}
              href={
                access
                  ? buildDashboardNetworkNodesHref(currentCharacterId, access)
                  : "#"
              }
              selected={pathname.endsWith("/network-nodes")}
              disabled={!access}
            >
              <ListItemText primary="Network Nodes" />
            </ListItemButton>
            <ListItemButton disabled>
              <ListItemText primary="Assemblies" />
            </ListItemButton>
            <ListItemButton disabled>
              <ListItemText primary="Ships" />
            </ListItemButton>
            <ListItemButton disabled>
              <ListItemText primary="Gates" />
            </ListItemButton>
          </List>
        </Box>
      </Stack>
    </Drawer>
  );
}

export { drawerWidth };
