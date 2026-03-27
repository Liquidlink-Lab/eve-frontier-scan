import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { AssemblySummary, WalletAccessContext } from "@/lib/eve/types";
import { renderWithProviders } from "@/test/renderWithProviders";
import AssembliesPage from "./AssembliesPage";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

const access: WalletAccessContext = {
  source: "sui-address",
  walletAddress: "0xwallet-1",
};

const groups: Record<string, AssemblySummary[]> = {
  "Heavy Refinery": [
    {
      id: "0xrefinery-1",
      name: "Refinery One",
      systemName: null,
      status: "offline",
      typeId: 88064,
      typeLabel: "Heavy Refinery",
      typeRepr: "0xpkg::assembly::Assembly",
    },
  ],
  "Heavy Storage": [
    {
      id: "0xabcdef1234567890",
      name: "Heavy Storage · 0xabcd…7890",
      systemName: null,
      status: "online",
      typeId: 77917,
      typeLabel: "Heavy Storage",
      typeRepr: "0xpkg::storage_unit::StorageUnit",
    },
  ],
};

describe("AssembliesPage", () => {
  it("renders only populated groups, fallback names, wiki links, and details routes", () => {
    renderWithProviders(
      <AssembliesPage
        access={access}
        characterId="0xchar-1"
        characterName="Rhea Ancru"
        groups={groups}
      />,
    );

    expect(screen.getByRole("heading", { name: "Assemblies" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^refresh$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Heavy Storage" })).toHaveAttribute(
      "href",
      "https://evefrontier.wiki/Heavy_Storage",
    );
    expect(screen.getByText("Heavy Storage · 0xabcd…7890")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /details/i })).toHaveLength(2);
    expect(screen.getAllByText("Unknown").length).toBeGreaterThan(0);
  });
});
