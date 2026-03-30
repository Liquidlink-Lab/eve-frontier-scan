import type { ComponentProps } from "react";
import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  buildDashboardAssemblyDetailHref,
  buildDashboardNetworkNodesHref,
  buildDashboardNetworkNodeDetailHref,
} from "@/lib/eve/routes";
import type { WalletAccessContext } from "@/lib/eve/types";
import type { AssemblyDetailSummary } from "@/lib/eve/types";
import { renderWithProviders } from "@/test/renderWithProviders";
import AssemblyDetailPage from "./AssemblyDetailPage";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

const assembly: AssemblyDetailSummary = {
  id: "0xabcdef1234567890",
  name: "Heavy Storage · 0xabcd…7890",
  iconUrl: "https://cdn.example/types/77917.png",
  systemName: "30013131",
  location: {
    solarSystemId: 30013131,
    x: "-200",
    y: "50",
    z: "6000",
  },
  status: "online",
  typeId: 77917,
  typeLabel: "Heavy Storage",
  typeRepr: "0xpkg::storage_unit::StorageUnit",
  description: null,
  url: null,
  itemId: null,
  tenant: null,
  ownerCapId: null,
  energySourceId: null,
  energySourceName: null,
  linkedGateId: null,
  linkedGateName: null,
  extensionType: null,
  extensionLabel: "Default logic",
  extensionFrozen: null,
  gateAccessMode: null,
};

const access: WalletAccessContext = {
  walletAddress: "0xwallet-1",
  source: "eve-vault",
};

describe("AssemblyDetailPage", () => {
  it("renders object identity, type links, and generic status details", () => {
    renderWithProviders(
      <AssemblyDetailPage characterName="Rhea Ancru" assembly={assembly} />,
    );

    expect(
      screen.getByRole("link", { name: "0xabcd…7890" }),
    ).toHaveAttribute(
      "href",
      "https://suiscan.xyz/testnet/object/0xabcdef1234567890",
    );
    expect(screen.getByRole("img", { name: "Heavy Storage icon" })).toHaveAttribute(
      "src",
      "https://cdn.example/types/77917.png",
    );
    expect(screen.getByRole("img", { name: "Heavy Storage icon" })).toHaveStyle({
      width: "64px",
      height: "64px",
    });
    expect(document.head.textContent).toContain("min-width:600px");
    expect(document.head.textContent).toContain("width:80px");
    expect(document.head.textContent).toContain("height:80px");
    expect(screen.getByText("Heavy Storage")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Heavy Storage" })).not.toBeInTheDocument();
    expect(screen.getByText("online")).toBeInTheDocument();
    expect(screen.getByText("Rhea Ancru")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^refresh$/i })).toBeInTheDocument();
    expect(screen.getByText("30013131")).toBeInTheDocument();
    expect(screen.getByText("-200, 50, 6000")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Inventory" }),
    ).not.toBeInTheDocument();
  });

  it("renders storage inventory items in a table when inventory data is present", () => {
    renderWithProviders(
      <AssemblyDetailPage
        {...({
          characterName: "Rhea Ancru",
          assembly,
          storageInventory: {
            maxCapacity: 20_000_000,
            usedCapacity: 195,
            items: [
              {
                itemId: 1_000_000_019_584,
                itemName: "Antimatter Charge",
                iconUrl: "https://cdn.example/items/82134.png",
                quantity: 3,
                typeId: 82_134,
                volume: 65,
              },
              {
                itemId: 1_000_000_099_999,
                itemName: "Unknown item (type_id: 99999)",
                iconUrl: null,
                quantity: 2,
                typeId: 99_999,
                volume: 1,
              },
            ],
          },
        } as ComponentProps<typeof AssemblyDetailPage>)}
      />,
    );

    expect(screen.getByRole("heading", { name: "Inventory" })).toBeInTheDocument();
    expect(screen.getByText("Capacity used")).toBeInTheDocument();
    expect(screen.getByText("0.001%")).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "Storage capacity usage" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Item name" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Quantity" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Volume" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Item ID" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Type ID" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Antimatter Charge icon" })).toHaveAttribute(
      "src",
      "https://cdn.example/items/82134.png",
    );
    expect(
      screen.getByLabelText("Unknown item (type_id: 99999) icon fallback"),
    ).toBeInTheDocument();
    expect(screen.getByText("Antimatter Charge")).toBeInTheDocument();
    expect(screen.getByText("Unknown item (type_id: 99999)")).toBeInTheDocument();
    expect(screen.getByText("1000000019584")).toBeInTheDocument();
    expect(screen.getByText("1000000099999")).toBeInTheDocument();
  });

  it("renders distinct owner inventory and open storage sections for storage units", () => {
    renderWithProviders(
      <AssemblyDetailPage
        {...({
          characterName: "Rhea Ancru",
          assembly,
          storageInventories: {
            ownerInventory: {
              maxCapacity: 20_000_000,
              usedCapacity: 195,
              items: [
                {
                  itemId: 1_000_000_019_584,
                  itemName: "Antimatter Charge",
                  iconUrl: "https://cdn.example/items/82134.png",
                  quantity: 3,
                  typeId: 82_134,
                  volume: 65,
                },
              ],
            },
            openStorageInventory: {
              maxCapacity: 20_000_000,
              usedCapacity: 5_200,
              items: [
                {
                  itemId: 1_000_000_078_437,
                  itemName: "EU-90 Fuel",
                  iconUrl: "https://cdn.example/items/78437.png",
                  quantity: 12,
                  typeId: 78_437,
                  volume: 28,
                },
              ],
            },
            playerOwnedInventories: [],
          },
        } as ComponentProps<typeof AssemblyDetailPage>)}
      />,
    );

    expect(screen.getByRole("heading", { name: "Owner inventory" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Open storage" })).toBeInTheDocument();
    expect(screen.getAllByText("Capacity used")).toHaveLength(2);
    expect(
      screen.getByRole("progressbar", { name: "Owner inventory capacity usage" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "Open storage capacity usage" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Antimatter Charge")).toBeInTheDocument();
    expect(screen.getByText("EU-90 Fuel")).toBeInTheDocument();
  });

  it("renders player-owned inventory sections when present", () => {
    renderWithProviders(
      <AssemblyDetailPage
        characterId="0xcharacter-1"
        characterName="Rhea Ancru"
        assembly={assembly}
        storageInventories={{
          ownerInventory: {
            maxCapacity: 20_000_000,
            usedCapacity: 195,
            items: [],
          },
          openStorageInventory: {
            maxCapacity: 20_000_000,
            usedCapacity: 5_200,
            items: [],
          },
          playerOwnedInventories: [
            {
              ownerCapId: "0xplayer-cap-1",
              characterId: "0xpilot-1",
              characterName: "Hshiki",
              characterWalletAddress: "0xpilot-wallet-1",
              inventory: {
                maxCapacity: 20_000_000,
                usedCapacity: 780,
                items: [
                  {
                    itemId: 1_000_000_089_089,
                    itemName: "Building Foam",
                    iconUrl: "https://cdn.example/items/89089.png",
                    quantity: 2,
                    typeId: 89_089,
                    volume: 390,
                  },
                ],
              },
            },
          ],
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Player inventory · Hshiki" })).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "Player inventory · Hshiki capacity usage" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Building Foam icon" })).toHaveAttribute(
      "src",
      "https://cdn.example/items/89089.png",
    );
    expect(screen.getByRole("link", { name: "Pilot Hshiki" })).toHaveAttribute(
      "href",
      buildDashboardNetworkNodesHref("0xpilot-1", {
        walletAddress: "0xpilot-wallet-1",
        source: "sui-address",
      }),
    );
  });

  it("renders recent inventory activity for storage units", () => {
    renderWithProviders(
      <AssemblyDetailPage
        characterId="0xcharacter-1"
        characterName="Rhea Ancru"
        assembly={{
          ...assembly,
          recentInventoryActivity: [
            {
              txDigest: "tx-storage-1",
              timestampMs: 1710000000000,
              action: "deposited",
              itemId: 1_000_000_015_002,
              itemName: "Building Foam",
              iconUrl: "https://cdn.example/items/89089.png",
              quantity: 12,
              typeId: 89_089,
              characterId: "0xpilot-1",
              characterItemId: 2_112_000_137,
              characterName: "Hshiki",
              characterWalletAddress: "0xpilot-wallet-1",
            },
          ],
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Recent inventory activity" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Mar 9, 2024, 16:00 UTC")).toBeInTheDocument();
    expect(screen.getByText("Deposited 12x Building Foam")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Building Foam icon" })).toHaveAttribute(
      "src",
      "https://cdn.example/items/89089.png",
    );
    expect(screen.getByRole("link", { name: "Pilot Hshiki" })).toHaveAttribute(
      "href",
      buildDashboardNetworkNodesHref("0xpilot-1", {
        walletAddress: "0xpilot-wallet-1",
        source: "sui-address",
      }),
    );
    expect(screen.getByRole("link", { name: /view inventory event on suiscan/i })).toHaveAttribute(
      "href",
      "https://suiscan.xyz/testnet/tx/tx-storage-1",
    );
  });

  it("renders gate-specific direct detail fields when present", () => {
    renderWithProviders(
      <AssemblyDetailPage
        characterName="Rhea Ancru"
        access={access}
        assembly={{
          ...assembly,
          id: "0xgate-1",
          name: "Transit Authority",
          iconUrl: "https://cdn.example/types/84955.png",
          typeId: 84955,
          typeLabel: "Gate",
          typeRepr: "0xpkg::gate::Gate",
          description: "Permit-managed border gate.",
          url: "https://example.com/transit-authority",
          itemId: 1000000012001,
          tenant: "utopia",
          ownerCapId: "0xowner-cap-1",
          energySourceId: "0xnode-1",
          energySourceName: "Power Spine",
          linkedGateId: "0xgate-2",
          linkedGateName: "Far Horizon",
          extensionType: "0xextension::gate_rules::GateAuth",
          extensionLabel: "Custom extension",
          extensionFrozen: true,
          gateAccessMode: "Permit required",
          gateMaxLinkDistance: 400000,
          recentJumps: [
            {
              txDigest: "tx-jump-1",
              timestampMs: 1710000000000,
              sourceGateId: "0xgate-1",
              sourceGateItemId: 1001,
              sourceGateName: "Transit Authority",
              destinationGateId: "0xgate-2",
              destinationGateItemId: 1002,
              destinationGateName: "Far Horizon",
              characterId: "0x1111111111111111",
              characterItemId: 2112000137,
              characterName: "Hshiki",
              characterWalletAddress: "0xpilot-wallet-1",
            },
          ],
          recentPermits: [
            {
              txDigest: "tx-permit-1",
              jumpPermitId: "0xpermit-1",
              sourceGateId: "0xgate-1",
              sourceGateItemId: 1001,
              sourceGateName: "Transit Authority",
              destinationGateId: "0xgate-2",
              destinationGateItemId: 1002,
              destinationGateName: "Far Horizon",
              characterId: "0x1111111111111111",
              characterItemId: 2112000137,
              expiresAtMs: 1710003600000,
              extensionType: "0xextension::gate_rules::GateAuth",
              timestampMs: 1710000002000,
              characterName: "Hshiki",
              characterWalletAddress: "0xpilot-wallet-1",
            },
          ],
        }}
        characterId="0xcharacter-1"
      />,
    );

    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Permit-managed border gate.")).toBeInTheDocument();
    const referenceUrlLink = screen.getByRole("link", {
      name: "https://example.com/transit-authority",
    });
    expect(referenceUrlLink).toHaveAttribute(
      "href",
      "https://example.com/transit-authority",
    );
    expect(referenceUrlLink).toHaveAttribute("target", "_blank");
    expect(referenceUrlLink).toHaveAttribute("rel", "noreferrer");
    expect(
      within(referenceUrlLink).getByTestId("reference-url-external-icon"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Tenant item ID")).not.toBeInTheDocument();
    expect(screen.queryByText("Tenant")).not.toBeInTheDocument();
    expect(screen.queryByText("Owner Cap")).not.toBeInTheDocument();
    expect(screen.getByText("Powered by")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Power Spine" })).toHaveAttribute(
      "href",
      buildDashboardNetworkNodeDetailHref("0xcharacter-1", "0xnode-1", access),
    );
    expect(screen.getByText("Linked gate")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Far Horizon" })[0]).toHaveAttribute(
      "href",
      buildDashboardAssemblyDetailHref("0xcharacter-1", "0xgate-2", access),
    );
    expect(screen.getByText("Extension")).toBeInTheDocument();
    expect(screen.getByText("Custom extension")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "0xextension::gate_rules::GateAuth" })).toHaveAttribute(
      "href",
      "https://suiscan.xyz/testnet/object/0xextension",
    );
    expect(screen.getByText("Extension frozen")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("Access mode")).toBeInTheDocument();
    expect(screen.getByText("Permit required")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Gate operations" })).toBeInTheDocument();
    expect(screen.queryByText("Max link distance")).not.toBeInTheDocument();
    expect(screen.queryByText("400000")).not.toBeInTheDocument();
    expect(screen.getByText("Recent jumps")).toBeInTheDocument();
    expect(screen.getByText("Mar 9, 2024, 16:00 UTC")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Transit Authority" })[0]).toHaveAttribute(
      "href",
      buildDashboardAssemblyDetailHref("0xcharacter-1", "0xgate-1", access),
    );
    expect(screen.getAllByRole("link", { name: "Far Horizon" })[1]).toHaveAttribute(
      "href",
      buildDashboardAssemblyDetailHref("0xcharacter-1", "0xgate-2", access),
    );
    expect(screen.getAllByRole("link", { name: "Pilot Hshiki" })[0]).toHaveAttribute(
      "href",
      buildDashboardNetworkNodesHref("0x1111111111111111", {
        walletAddress: "0xpilot-wallet-1",
        source: "sui-address",
      }),
    );
    expect(screen.getByRole("link", { name: /view jump event on suiscan/i })).toHaveAttribute(
      "href",
      "https://suiscan.xyz/testnet/tx/tx-jump-1",
    );
    expect(screen.getByText("Recent permits")).toBeInTheDocument();
    expect(screen.getByText("Mar 9, 2024, 17:00 UTC")).toBeInTheDocument();
    expect(screen.getByText("Permit 0xpermit-1")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Transit Authority" })[1]).toHaveAttribute(
      "href",
      buildDashboardAssemblyDetailHref("0xcharacter-1", "0xgate-1", access),
    );
    expect(screen.getAllByRole("link", { name: "Far Horizon" })[2]).toHaveAttribute(
      "href",
      buildDashboardAssemblyDetailHref("0xcharacter-1", "0xgate-2", access),
    );
    expect(screen.getAllByRole("link", { name: "Pilot Hshiki" })[1]).toHaveAttribute(
      "href",
      buildDashboardNetworkNodesHref("0x1111111111111111", {
        walletAddress: "0xpilot-wallet-1",
        source: "sui-address",
      }),
    );
    expect(screen.getByRole("link", { name: /view permit event on suiscan/i })).toHaveAttribute(
      "href",
      "https://suiscan.xyz/testnet/tx/tx-permit-1",
    );
  });

  it("normalizes scheme-less reference urls so they always open externally", () => {
    renderWithProviders(
      <AssemblyDetailPage
        characterName="Rhea Ancru"
        assembly={{
          ...assembly,
          url: "example.com/reference",
        }}
      />,
    );

    expect(screen.getByRole("link", { name: "example.com/reference" })).toHaveAttribute(
      "href",
      "https://example.com/reference",
    );
  });

  it("renders turret direct detail fields when present", () => {
    renderWithProviders(
      <AssemblyDetailPage
        characterName="Rhea Ancru"
        access={access}
        assembly={{
          ...assembly,
          id: "0xturret-1",
          name: "Sentinel Grid",
          iconUrl: "https://cdn.example/types/84556.png",
          typeId: 84556,
          typeLabel: "Smart Turret",
          typeRepr: "0xpkg::turret::Turret",
          description: "Aggressor-first defensive turret.",
          url: "https://example.com/sentinel-grid",
          itemId: 1000000013001,
          tenant: "utopia",
          ownerCapId: "0xowner-cap-1",
          energySourceId: "0xnode-1",
          energySourceName: "Power Spine",
          extensionType: "0xextension::turret_rules::TurretAuth",
          extensionLabel: "Custom extension",
          extensionFrozen: false,
          latestTurretPrioritySnapshot: {
            txDigest: "tx-turret-1",
            updatedAtMs: 1710000000000,
            targets: [
              {
                itemId: 501,
                typeId: 84556,
                groupId: 12,
                characterId: 31,
                characterTribe: 4,
                hpRatio: 80,
                shieldRatio: 55,
                armorRatio: 92,
                isAggressor: true,
                priorityWeight: 11000,
                behaviourChange: "STARTED_ATTACK",
              },
            ],
          },
        }}
        characterId="0xcharacter-1"
      />,
    );

    expect(screen.getByText("Aggressor-first defensive turret.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "https://example.com/sentinel-grid" })).toHaveAttribute(
      "href",
      "https://example.com/sentinel-grid",
    );
    expect(screen.queryByText("Tenant item ID")).not.toBeInTheDocument();
    expect(screen.queryByText("Tenant")).not.toBeInTheDocument();
    expect(screen.queryByText("Owner Cap")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Power Spine" })).toHaveAttribute(
      "href",
      buildDashboardNetworkNodeDetailHref("0xcharacter-1", "0xnode-1", access),
    );
    expect(screen.getByText("0xextension::turret_rules::TurretAuth")).toBeInTheDocument();
    expect(screen.getByText("Extension frozen")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Latest target priority snapshot" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Updated at")).toBeInTheDocument();
    expect(screen.getByText("Mar 9, 2024, 16:00 UTC")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Item ID" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Priority" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Behaviour" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Aggressor" })).toBeInTheDocument();
    expect(screen.getByText("501")).toBeInTheDocument();
    expect(screen.getByText("11000")).toBeInTheDocument();
    expect(screen.getByText("STARTED_ATTACK")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.queryByText("Access mode")).not.toBeInTheDocument();
  });
});
