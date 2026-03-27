import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { buildDashboardAssemblyDetailHref } from "@/lib/eve/routes";
import type { NetworkNodeDetailSummary, WalletAccessContext } from "@/lib/eve/types";
import { renderWithProviders } from "@/test/renderWithProviders";
import NetworkNodeDetailPage from "./NetworkNodeDetailPage";

const access: WalletAccessContext = {
  source: "eve-vault",
  walletAddress: "0xwallet-1",
};

const networkNode: NetworkNodeDetailSummary = {
  id: "0x0123456789abcdef",
  name: "Power Spine",
  systemName: "30013131",
  location: {
    solarSystemId: 30013131,
    x: "-100",
    y: "25",
    z: "3000",
  },
  connectedAssemblyCount: 5,
  status: "online",
  fuelPercent: 28,
  fuelEtaMs: 3_240_000_000,
  fuelQuantity: 999,
  connectedAssemblies: [
    {
      id: "0xgate-1",
      name: "Argent Gate",
      typeLabel: "Gate",
      status: "online",
    },
    {
      id: "0xstorage-1",
      name: "Vault Alpha",
      typeLabel: "Heavy Storage",
      status: "online",
    },
    {
      id: "0xturret-1",
      name: "Bastion One",
      typeLabel: "Smart Turret",
      status: "offline",
    },
  ],
  connectedAssemblyGroups: [
    {
      label: "Gate",
      assemblies: [
        {
          id: "0xgate-1",
          name: "Argent Gate",
          typeLabel: "Gate",
          status: "online",
        },
      ],
    },
    {
      label: "Storage",
      assemblies: [
        {
          id: "0xstorage-1",
          name: "Vault Alpha",
          typeLabel: "Heavy Storage",
          status: "online",
        },
      ],
    },
    {
      label: "Turret",
      assemblies: [
        {
          id: "0xturret-1",
          name: "Bastion One",
          typeLabel: "Smart Turret",
          status: "offline",
        },
      ],
    },
    {
      label: "Other",
      assemblies: [],
    },
  ],
};

describe("NetworkNodeDetailPage", () => {
  it("renders the planned network node identity, fuel fields, and grouped assemblies", () => {
    renderWithProviders(
      <NetworkNodeDetailPage
        access={access}
        characterName="Rhea Ancru"
        networkNode={networkNode}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Power Spine" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "0x0123…cdef" }),
    ).toHaveAttribute(
      "href",
      "https://suiscan.xyz/testnet/object/0x0123456789abcdef",
    );
    expect(screen.getByText("Rhea Ancru")).toBeInTheDocument();
    expect(screen.getAllByText("online").length).toBeGreaterThan(0);
    expect(screen.getByText("30013131")).toBeInTheDocument();
    expect(screen.getByText("-100, 25, 3000")).toBeInTheDocument();
    expect(screen.getByText("28%")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Fuel level" })).toHaveAttribute(
      "aria-valuenow",
      "28",
    );
    expect(screen.getByText("37d 12h")).toBeInTheDocument();
    expect(screen.getByText("999")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Gate" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Storage" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Turret" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Shipyard-like / ship-support" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Argent Gate")).toBeInTheDocument();
    expect(screen.getByText("Vault Alpha")).toBeInTheDocument();
    expect(screen.getByText("Bastion One")).toBeInTheDocument();
  });

  it("renders detail links for each related assembly when character context is available", () => {
    renderWithProviders(
      <NetworkNodeDetailPage
        access={access}
        characterId="0xcharacter-1"
        characterName="Rhea Ancru"
        networkNode={networkNode}
      />,
    );

    const detailLinks = screen.getAllByRole("link", { name: "Details" });

    expect(detailLinks).toHaveLength(3);
    expect(detailLinks[0]).toHaveAttribute(
      "href",
      buildDashboardAssemblyDetailHref("0xcharacter-1", "0xgate-1", access),
    );
    expect(detailLinks[1]).toHaveAttribute(
      "href",
      buildDashboardAssemblyDetailHref("0xcharacter-1", "0xstorage-1", access),
    );
    expect(detailLinks[2]).toHaveAttribute(
      "href",
      buildDashboardAssemblyDetailHref("0xcharacter-1", "0xturret-1", access),
    );
  });
});
