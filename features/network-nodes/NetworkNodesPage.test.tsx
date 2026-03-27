import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { NetworkNodeSummary, WalletAccessContext } from "@/lib/eve/types";
import { renderWithProviders } from "@/test/renderWithProviders";
import NetworkNodesPage from "./NetworkNodesPage";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

const access: WalletAccessContext = {
  source: "eve-vault",
  walletAddress: "0xwallet-1",
};

const networkNodes: NetworkNodeSummary[] = [
  {
    id: "0xnode-1",
    name: "Alpha Spine",
    systemName: "Ammatar",
    connectedAssemblyCount: 3,
    status: "online",
    fuelPercent: 40,
    fuelEtaMs: 5_400_000,
    fuelQuantity: 400,
    connectedAssemblies: [],
  },
  {
    id: "0xnode-2",
    name: "Gamma Relay",
    systemName: "Semiki",
    connectedAssemblyCount: 5,
    status: "offline",
    fuelPercent: 60,
    fuelEtaMs: null,
    fuelQuantity: 600,
    connectedAssemblies: [],
  },
  {
    id: "0xnode-3",
    name: "Beta Spine",
    systemName: "Anamake",
    connectedAssemblyCount: 3,
    status: "online",
    fuelPercent: 10,
    fuelEtaMs: 9_000_000,
    fuelQuantity: 100,
    connectedAssemblies: [],
  },
];

describe("NetworkNodesPage", () => {
  it("renders the network nodes table with the planned column order and row sort", () => {
    renderWithProviders(
      <NetworkNodesPage
        access={access}
        characterId="0xchar-1"
        characterName="Rhea Ancru"
        networkNodes={networkNodes}
      />,
    );

    expect(
      screen.getAllByRole("columnheader").map((cell) => cell.textContent?.trim()),
    ).toEqual([
      "Status",
      "Name",
      "Solar System",
      "Fuel",
      "Connected Assemblies",
      "",
    ]);

    expect(screen.getByRole("button", { name: /^refresh$/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /details/i })).toHaveLength(3);
    expect(screen.getByText("ETA 1h 30m")).toBeInTheDocument();
    expect(screen.getByText("ETA 2h 30m")).toBeInTheDocument();
    expect(screen.getByText("ETA Unavailable")).toBeInTheDocument();

    expect(screen.getAllByRole("row").slice(1).map((row) => row.textContent)).toEqual([
      expect.stringContaining("Gamma Relay"),
      expect.stringContaining("Beta Spine"),
      expect.stringContaining("Alpha Spine"),
    ]);
  });

  it("renders an empty state that suggests switching characters or checking assemblies", () => {
    renderWithProviders(
      <NetworkNodesPage
        access={access}
        characterId="0xchar-1"
        characterName="Rhea Ancru"
        networkNodes={[]}
      />,
    );

    expect(screen.getByText(/switch to another character/i)).toBeInTheDocument();
    expect(screen.getByText(/check assemblies/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^refresh$/i })).toBeInTheDocument();
  });
});
