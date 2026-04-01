"use client";

import Link from "next/link";
import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";

import { formatShortAddress } from "@/lib/eve/address";
import {
  mapDiscoveryToAssembliesByType,
  mapDiscoveryToNetworkNodeDetail,
} from "@/lib/eve/discovery/eveOwnershipMappers";
import { eveLabelLookups } from "@/lib/eve/lookups";
import {
  buildDashboardDefaultHref,
  buildDashboardAssembliesHref,
  buildDashboardNetworkNodesHref,
} from "@/lib/eve/routes";
import type {
  CharacterSummary,
  WalletAccessContext,
  WalletStructureDiscovery,
} from "@/lib/eve/types";

interface DashboardBreadcrumbsProps {
  access: WalletAccessContext | null;
  characterId: string;
  characters: CharacterSummary[];
  discovery: WalletStructureDiscovery | undefined;
  pathname: string;
}

interface BreadcrumbItem {
  href?: string;
  label: string;
}

export default function DashboardBreadcrumbs({
  access,
  characterId,
  characters,
  discovery,
  pathname,
}: DashboardBreadcrumbsProps) {
  const items = buildBreadcrumbItems({
    access,
    characterId,
    characters,
    discovery,
    pathname,
  });

  if (items === null) {
    return null;
  }

  return (
    <Breadcrumbs
      aria-label="Breadcrumbs"
      separator="›"
      sx={{
        color: "text.secondary",
        overflowX: "auto",
        overflowY: "hidden",
        whiteSpace: "nowrap",
        scrollbarWidth: "thin",
        "& .MuiBreadcrumbs-ol": {
          flexWrap: "nowrap",
        },
        "& .MuiBreadcrumbs-separator": {
          mx: 0.75,
        },
      }}
    >
      {items.map((item, index) =>
        item.href && index < items.length - 1 ? (
          <MuiLink
            key={`${item.label}-${item.href}`}
            component={Link}
            href={item.href}
            underline="hover"
            color="inherit"
            sx={{
              fontSize: "0.88rem",
              whiteSpace: "nowrap",
            }}
          >
            {item.label}
          </MuiLink>
        ) : (
          <Typography
            key={`${item.label}-${index}`}
            color="text.primary"
            sx={{
              fontSize: "0.88rem",
              fontWeight: index === items.length - 1 ? 600 : 400,
              whiteSpace: "nowrap",
            }}
          >
            {item.label}
          </Typography>
        ),
      )}
    </Breadcrumbs>
  );
}

function buildBreadcrumbItems({
  access,
  characterId,
  characters,
  discovery,
  pathname,
}: DashboardBreadcrumbsProps): BreadcrumbItem[] | null {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] !== "dashboard" || segments[1] !== characterId) {
    return null;
  }

  const section = segments[2];
  const detailId = segments[3] ?? null;
  const currentCharacter =
    characters.find((character) => character.id === characterId) ?? null;
  const currentCharacterHref =
    access && currentCharacter
      ? buildDashboardDefaultHref(
          characterId,
          access,
          currentCharacter.defaultDashboardSection,
        )
      : undefined;
  const networkNodesHref = access
    ? buildDashboardNetworkNodesHref(characterId, access)
    : undefined;

  if (currentCharacter === null) {
    return null;
  }

  const items: BreadcrumbItem[] = [
    {
      href: currentCharacterHref,
      label: currentCharacter.name,
    },
  ];

  if (section === "network-nodes") {
    if (detailId) {
      items.push({
        href: networkNodesHref,
        label: "Network Nodes",
      });
      items.push({
        label: getNetworkNodeLabel(discovery, characterId, detailId),
      });
    } else {
      items.push({
        label: "Network Nodes",
      });
    }

    return items;
  }

  if (section === "assemblies") {
    const assembliesHref = access
      ? buildDashboardAssembliesHref(characterId, access)
      : undefined;

    if (detailId) {
      items.push({
        href: assembliesHref,
        label: "Assemblies",
      });
      items.push({
        label: getAssemblyLabel(discovery, characterId, detailId),
      });
    } else {
      items.push({
        label: "Assemblies",
      });
    }

    return items;
  }

  if (section === "gates") {
    items.push({
      label: "Gates",
    });

    return items;
  }

  if (section === "ships") {
    items.push({
      label: "Ships",
    });

    return items;
  }

  return items;
}

function getNetworkNodeLabel(
  discovery: WalletStructureDiscovery | undefined,
  characterId: string,
  nodeId: string,
) {
  const detail = discovery
    ? mapDiscoveryToNetworkNodeDetail(
        discovery,
        characterId,
        nodeId,
        eveLabelLookups,
      )
    : null;

  return detail?.name ?? formatShortAddress(nodeId);
}

function getAssemblyLabel(
  discovery: WalletStructureDiscovery | undefined,
  characterId: string,
  assemblyId: string,
) {
  if (!discovery) {
    return formatShortAddress(assemblyId);
  }

  const groupedAssemblies = mapDiscoveryToAssembliesByType(
    discovery,
    characterId,
    eveLabelLookups,
  );

  for (const assemblies of Object.values(groupedAssemblies)) {
    const assembly = assemblies.find((entry) => entry.id === assemblyId);

    if (assembly) {
      return assembly.name;
    }
  }

  return formatShortAddress(assemblyId);
}
