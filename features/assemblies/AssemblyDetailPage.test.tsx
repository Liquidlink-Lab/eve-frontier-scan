import type { ComponentProps } from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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
    expect(screen.getByRole("link", { name: "Heavy Storage" })).toHaveAttribute(
      "href",
      "https://evefrontier.wiki/Heavy_Storage",
    );
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
                quantity: 3,
                typeId: 82_134,
                volume: 65,
              },
              {
                itemId: 1_000_000_099_999,
                itemName: "Unknown item (type_id: 99999)",
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
    expect(screen.getByText("Antimatter Charge")).toBeInTheDocument();
    expect(screen.getByText("Unknown item (type_id: 99999)")).toBeInTheDocument();
    expect(screen.getByText("1000000019584")).toBeInTheDocument();
    expect(screen.getByText("1000000099999")).toBeInTheDocument();
  });

  it("renders gate-specific direct detail fields when present", () => {
    renderWithProviders(
      <AssemblyDetailPage
        characterName="Rhea Ancru"
        assembly={{
          ...assembly,
          id: "0xgate-1",
          name: "Transit Authority",
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
          gateAccessMode: "Permit required",
        }}
      />,
    );

    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Permit-managed border gate.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "https://example.com/transit-authority" })).toHaveAttribute(
      "href",
      "https://example.com/transit-authority",
    );
    expect(screen.getByText("Tenant item ID")).toBeInTheDocument();
    expect(screen.getByText("1000000012001")).toBeInTheDocument();
    expect(screen.getByText("Tenant")).toBeInTheDocument();
    expect(screen.getByText("utopia")).toBeInTheDocument();
    expect(screen.getByText("Owner Cap")).toBeInTheDocument();
    expect(screen.getByText("0xowner-cap-1")).toBeInTheDocument();
    expect(screen.getByText("Powered by")).toBeInTheDocument();
    expect(screen.getByText("Power Spine")).toBeInTheDocument();
    expect(screen.getByText("Linked gate")).toBeInTheDocument();
    expect(screen.getByText("Far Horizon")).toBeInTheDocument();
    expect(screen.getByText("Extension")).toBeInTheDocument();
    expect(screen.getByText("Custom extension")).toBeInTheDocument();
    expect(screen.getByText("0xextension::gate_rules::GateAuth")).toBeInTheDocument();
    expect(screen.getByText("Access mode")).toBeInTheDocument();
    expect(screen.getByText("Permit required")).toBeInTheDocument();
  });

  it("renders turret direct detail fields when present", () => {
    renderWithProviders(
      <AssemblyDetailPage
        characterName="Rhea Ancru"
        assembly={{
          ...assembly,
          id: "0xturret-1",
          name: "Sentinel Grid",
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
        }}
      />,
    );

    expect(screen.getByText("Aggressor-first defensive turret.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "https://example.com/sentinel-grid" })).toHaveAttribute(
      "href",
      "https://example.com/sentinel-grid",
    );
    expect(screen.getByText("1000000013001")).toBeInTheDocument();
    expect(screen.getByText("Power Spine")).toBeInTheDocument();
    expect(screen.getByText("0xextension::turret_rules::TurretAuth")).toBeInTheDocument();
    expect(screen.queryByText("Access mode")).not.toBeInTheDocument();
  });
});
