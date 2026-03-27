import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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
  systemName: null,
  connectedAssemblyCount: 4,
  status: "online",
  fuelPercent: 60,
  fuelQuantity: 6,
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
      label: "Shipyard-like / ship-support",
      assemblies: [],
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
    expect(screen.getByText("Unknown")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Gate" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Storage" })).toBeInTheDocument();
    expect(screen.getByText("Argent Gate")).toBeInTheDocument();
    expect(screen.getByText("Vault Alpha")).toBeInTheDocument();
  });
});
