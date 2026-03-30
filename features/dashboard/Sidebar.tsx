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

import BrandLogo from "@/features/brand/BrandLogo";
import { formatShortAddress } from "@/lib/eve/address";
import {
  buildDashboardAssembliesHref,
  buildDashboardNetworkNodesHref,
  getWalletSourceLabel,
} from "@/lib/eve/routes";
import { getSuiscanAddressUrl } from "@/lib/eve/suiscan";
import type { CharacterSummary, WalletAccessContext } from "@/lib/eve/types";
import CharacterSwitcher from "./CharacterSwitcher";

const drawerWidth = 296;

interface SidebarProps {
  access: WalletAccessContext | null;
  characters: CharacterSummary[];
  currentCharacterId: string;
  mobileOpen: boolean;
  onClose: () => void;
  pathname: string;
}

export default function Sidebar({
  access,
  characters,
  currentCharacterId,
  mobileOpen,
  onClose,
  pathname,
}: SidebarProps) {
  const currentCharacter =
    characters.find((character) => character.id === currentCharacterId) ?? null;

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: false,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": drawerPaperSx,
        }}
      >
        <SidebarContent
          access={access}
          characters={characters}
          currentCharacter={currentCharacter}
          currentCharacterId={currentCharacterId}
          pathname={pathname}
          onNavigate={onClose}
        />
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": drawerPaperSx,
        }}
      >
        <SidebarContent
          access={access}
          characters={characters}
          currentCharacter={currentCharacter}
          currentCharacterId={currentCharacterId}
          pathname={pathname}
          onNavigate={() => {}}
        />
      </Drawer>
    </>
  );
}

interface SidebarContentProps {
  access: WalletAccessContext | null;
  characters: CharacterSummary[];
  currentCharacter: CharacterSummary | null;
  currentCharacterId: string;
  pathname: string;
  onNavigate: () => void;
}

function SidebarContent({
  access,
  characters,
  currentCharacter,
  currentCharacterId,
  pathname,
  onNavigate,
}: SidebarContentProps) {
  const shipsEnabled = false;
  const gatesEnabled = false;

  return (
    <Stack spacing={2.5} sx={{ height: "100%" }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <BrandLogo size={44} />
        <div>
          <Typography
            component="p"
            sx={{
              fontSize: "0.72rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "text.secondary",
            }}
          >
            EVE Frontier
          </Typography>
          <Typography variant="h6">Scan</Typography>
        </div>
      </Stack>

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
        onNavigate={onNavigate}
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
            onClick={onNavigate}
            selected={pathname.endsWith("/network-nodes")}
            disabled={!access}
          >
            <ListItemText primary="Network Nodes" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            href={access ? buildDashboardAssembliesHref(currentCharacterId, access) : "#"}
            onClick={onNavigate}
            selected={pathname.includes("/assemblies")}
            disabled={!access}
          >
            <ListItemText primary="Assemblies" />
          </ListItemButton>
          <ListItemButton
            selected={pathname.includes("/ships")}
            disabled={!shipsEnabled}
          >
            <ListItemText primary="Ships" />
          </ListItemButton>
          <ListItemButton
            selected={pathname.includes("/gates")}
            disabled={!gatesEnabled}
          >
            <ListItemText primary="Gates" />
          </ListItemButton>
        </List>
      </Box>
    </Stack>
  );
}

const drawerPaperSx = {
  width: drawerWidth,
  boxSizing: "border-box",
  borderRight: "1px solid rgba(148, 163, 184, 0.18)",
  backgroundColor: "rgba(8, 11, 17, 0.96)",
  backgroundImage:
    "linear-gradient(180deg, rgba(69, 170, 242, 0.08), rgba(8, 11, 17, 0))",
  color: "text.primary",
  px: 2.5,
  py: 3,
} as const;

export { drawerWidth };
