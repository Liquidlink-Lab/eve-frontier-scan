import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    setViewportWidth(1280);

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

    expect(
      await screen.findByRole("navigation", { name: /dashboard navigation/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-shell-content")).toHaveStyle({
      marginLeft: "296px",
    });
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
    expect(screen.getByRole("link", { name: /assemblies/i })).toHaveAttribute(
      "href",
      "/dashboard/0xchar-1/assemblies?wallet=0x43acdc9cb9e379d5fab90effbaaa08896d943d9958a96d9df6f07c39025cd186&source=eve-vault",
    );
    expect(screen.queryByRole("link", { name: /ships/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ships/i })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByRole("link", { name: /gates/i })).toHaveAttribute(
      "href",
      "/dashboard/0xchar-1/gates?wallet=0x43acdc9cb9e379d5fab90effbaaa08896d943d9958a96d9df6f07c39025cd186&source=eve-vault",
    );
    expect(
      screen.getByRole("textbox", { name: /inspect another address/i }),
    ).toBeInTheDocument();
    const header = screen.getByRole("banner");
    expect(
      within(header).queryByRole("navigation", { name: /breadcrumbs/i }),
    ).not.toBeInTheDocument();
    const breadcrumbs = screen.getByRole("navigation", { name: /breadcrumbs/i });
    expect(breadcrumbs).toBeInTheDocument();
    expect(within(breadcrumbs).getByRole("link", { name: "Rhea Ancru" })).toHaveAttribute(
      "href",
      "/dashboard/0xchar-1/network-nodes?wallet=0x43acdc9cb9e379d5fab90effbaaa08896d943d9958a96d9df6f07c39025cd186&source=eve-vault",
    );
    expect(within(breadcrumbs).getByText("Network Nodes")).toBeInTheDocument();
    expect(screen.getByText("network nodes page")).toBeInTheDocument();
  });

  it("collapses the sidebar behind a menu button on mobile", async () => {
    setViewportWidth(390);
    const user = userEvent.setup();

    renderWithProviders(
      <DashboardShell characterId="0xchar-1">
        <div>network nodes page</div>
      </DashboardShell>,
    );

    expect(screen.getByTestId("dashboard-shell-content")).toHaveStyle({
      marginLeft: "0px",
    });
    expect(
      screen.queryByRole("navigation", { name: /dashboard navigation/i }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /open dashboard navigation/i }),
    );

    expect(
      await screen.findByRole("navigation", { name: /dashboard navigation/i }),
    ).toBeInTheDocument();
  });

  it("renders breadcrumb hierarchy for dashboard detail routes", async () => {
    usePathname.mockReturnValue("/dashboard/0xchar-1/network-nodes/0xnode-1");

    renderWithProviders(
      <DashboardShell characterId="0xchar-1">
        <div>node detail page</div>
      </DashboardShell>,
    );

    const breadcrumbs = await screen.findByRole("navigation", {
      name: /breadcrumbs/i,
    });
    expect(breadcrumbs).toBeInTheDocument();
    expect(within(breadcrumbs).getByRole("link", { name: "Rhea Ancru" })).toHaveAttribute(
      "href",
      "/dashboard/0xchar-1/network-nodes?wallet=0x43acdc9cb9e379d5fab90effbaaa08896d943d9958a96d9df6f07c39025cd186&source=eve-vault",
    );
    expect(within(breadcrumbs).getByRole("link", { name: "Network Nodes" })).toHaveAttribute(
      "href",
      "/dashboard/0xchar-1/network-nodes?wallet=0x43acdc9cb9e379d5fab90effbaaa08896d943d9958a96d9df6f07c39025cd186&source=eve-vault",
    );
    expect(within(breadcrumbs).getByText("Power Spine")).toBeInTheDocument();
  });

  it("routes to a new lookup when the dashboard header search form is submitted", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <DashboardShell characterId="0xchar-1">
        <div>network nodes page</div>
      </DashboardShell>,
    );

    await user.type(
      await screen.findByRole("textbox", { name: /inspect another address/i }),
      " 0xAbCdEf1234 ",
    );
    await user.click(screen.getByRole("button", { name: /^inspect$/i }));

    expect(push).toHaveBeenCalledWith("/lookup/0xabcdef1234");
  });

  it("does not render the dashboard sidebar outside dashboard routes", () => {
    usePathname.mockReturnValue("/");

    renderWithProviders(
      <DashboardShell characterId="0xchar-1">
        <div>home page</div>
      </DashboardShell>,
    );

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: /inspect another address/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("home page")).toBeInTheDocument();
    expect(fetchWalletStructureDiscovery).not.toHaveBeenCalled();
  });
});

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  });

  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: evaluateMediaQuery(query, width),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

function evaluateMediaQuery(query: string, width: number) {
  const minMatch = query.match(/\(min-width:\s*(\d+)px\)/);
  const maxMatch = query.match(/\(max-width:\s*(\d+(?:\.\d+)?)px\)/);

  if (minMatch && width < Number(minMatch[1])) {
    return false;
  }

  if (maxMatch && width > Number(maxMatch[1])) {
    return false;
  }

  return true;
}
