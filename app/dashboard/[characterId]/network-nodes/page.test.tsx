import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";
import DashboardNetworkNodesPage from "./page";

const { fetchWalletStructureDiscovery, normalizeSuiAddress } = vi.hoisted(() => ({
  fetchWalletStructureDiscovery: vi.fn(),
  normalizeSuiAddress: vi.fn(),
}));

vi.mock("@/lib/eve/address", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/eve/address")>();

  return {
    ...actual,
    normalizeSuiAddress: (...args: unknown[]) => normalizeSuiAddress(...args),
  };
});

vi.mock("@/lib/eve/discovery/eveOwnershipClient", () => ({
  fetchWalletStructureDiscovery: (...args: unknown[]) =>
    fetchWalletStructureDiscovery(...args),
}));

describe("DashboardNetworkNodesPage", () => {
  beforeEach(() => {
    fetchWalletStructureDiscovery.mockReset();
    normalizeSuiAddress.mockReset();

    normalizeSuiAddress.mockReturnValue("0xwallet-1");
    fetchWalletStructureDiscovery.mockResolvedValue({
      walletAddress: "0xwallet-1",
      characters: [
        {
          characterId: "0xchar-1",
          character: {
            id: "0xchar-1",
            name: "Rhea Ancru",
            tribeId: 3,
            ownerCapId: "0xcap-1",
          },
          playerProfileIds: ["0xprofile-1"],
          ownedStructures: [
            {
              id: "0xnode-1",
              typeId: 88092,
              typeLabel: "Network Node",
              typeRepr: "0xpkg::network_node::NetworkNode",
              name: "Power Spine",
              ownerCapId: "0xcap-1",
              status: "online",
              fuelPercent: 50,
              fuelQuantity: 5,
              connectedAssemblyIds: [],
            },
          ],
        },
      ],
    });
  });

  it("renders network nodes for the selected character when wallet context is present", async () => {
    const page = await DashboardNetworkNodesPage({
      params: Promise.resolve({ characterId: "0xchar-1" }),
      searchParams: Promise.resolve({
        wallet: "0xwallet-1",
        source: "sui-address",
      }),
    });

    renderWithProviders(page);

    expect(screen.getByRole("heading", { name: /network nodes/i })).toBeInTheDocument();
    expect(screen.getByText("Power Spine")).toBeInTheDocument();
  });
});
