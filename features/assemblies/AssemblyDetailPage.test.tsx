import type { ComponentProps } from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { AssemblySummary } from "@/lib/eve/types";
import { renderWithProviders } from "@/test/renderWithProviders";
import AssemblyDetailPage from "./AssemblyDetailPage";

const assembly: AssemblySummary = {
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
});
