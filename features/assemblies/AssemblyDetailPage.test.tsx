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
  });
});
