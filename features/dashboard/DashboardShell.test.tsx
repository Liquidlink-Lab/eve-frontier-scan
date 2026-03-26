import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";
import DashboardShell from "./DashboardShell";

const push = vi.fn();

const {
  fetchWalletStructureDiscovery,
  usePathname,
  useSearchParams,
} = vi.hoisted(() => ({
  fetchWalletStructureDiscovery: vi.fn(),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => usePathname(),
  useRouter: () => ({
    push,
  }),
  useSearchParams: () => useSearchParams(),
}));

vi.mock("@/lib/eve/discovery/eveOwnershipClient", () => ({
  fetchWalletStructureDiscovery: (...args: unknown[]) =>
    fetchWalletStructureDiscovery(...args),
}));

describe("DashboardShell", () => {
  beforeEach(() => {
    push.mockReset();
    fetchWalletStructureDiscovery.mockReset();
    usePathname.mockReset();
    useSearchParams.mockReset();

    usePathname.mockReturnValue("/dashboard/0xchar-1/network-nodes");
    useSearchParams.mockReturnValue(
      new URLSearchParams({
        wallet:
          "0x43acdc9cb9e379d5fab90effbaaa08896d943d9958a96d9df6f07c39025cd186",
        source: "eve-vault",
      }),
    );
    fetchWalletStructureDiscovery.mockResolvedValue({
      walletAddress:
        "0x43acdc9cb9e379d5fab90effbaaa08896d943d9958a96d9df6f07c39025cd186",
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
        {
          characterId: "0xchar-2",
          character: {
            id: "0xchar-2",
            name: "Tara Voss",
            tribeId: 4,
            ownerCapId: "0xcap-2",
          },
          playerProfileIds: ["0xprofile-2"],
          ownedStructures: [],
        },
      ],
    });
  });

  it("renders the dashboard sidebar with wallet context, character switcher, and nav items", async () => {
    renderWithProviders(
      <DashboardShell characterId="0xchar-1">
        <div>network nodes page</div>
      </DashboardShell>,
    );

    expect(await screen.findByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("Connected EVE Vault")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "0x43ac…d186" }),
    ).toHaveAttribute(
      "href",
      "https://suiscan.xyz/testnet/account/0x43acdc9cb9e379d5fab90effbaaa08896d943d9958a96d9df6f07c39025cd186",
    );
    const switcher = screen.getByRole("combobox", { name: /character/i });
    await waitFor(() => {
      expect(switcher).not.toBeDisabled();
    });
    expect(switcher).toHaveTextContent("Rhea Ancru");
    expect(switcher).toHaveTextContent("Tara Voss");
    expect(screen.getByRole("link", { name: /network nodes/i })).toBeInTheDocument();
    expect(screen.getByText("Assemblies")).toBeInTheDocument();
    expect(screen.getByText("Ships")).toBeInTheDocument();
    expect(screen.getByText("Gates")).toBeInTheDocument();
    expect(screen.getByText("network nodes page")).toBeInTheDocument();
  });

  it("does not render the dashboard sidebar outside dashboard routes", () => {
    usePathname.mockReturnValue("/");

    renderWithProviders(
      <DashboardShell characterId="0xchar-1">
        <div>home page</div>
      </DashboardShell>,
    );

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(screen.getByText("home page")).toBeInTheDocument();
    expect(fetchWalletStructureDiscovery).not.toHaveBeenCalled();
  });
});
