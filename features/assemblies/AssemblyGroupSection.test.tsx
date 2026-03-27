import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { AssemblySummary, WalletAccessContext } from "@/lib/eve/types";
import { renderWithProviders } from "@/test/renderWithProviders";
import AssemblyGroupSection from "./AssemblyGroupSection";

const access: WalletAccessContext = {
  source: "eve-vault",
  walletAddress: "0xwallet-1",
};

const assemblies: AssemblySummary[] = [
  {
    id: "0xstorage-1",
    name: "Vault Alpha",
    iconUrl: "https://cdn.example/types/77917.png",
    systemName: "30013131",
    status: "online",
    typeId: 77917,
    typeLabel: "Heavy Storage",
    typeRepr: "0xpkg::storage_unit::StorageUnit",
  },
];

describe("AssemblyGroupSection", () => {
  it("keeps the assembly table horizontally scrollable on narrow screens", () => {
    renderWithProviders(
      <AssemblyGroupSection
        access={access}
        characterId="0xcharacter-1"
        groupLabel="Storage"
        assemblies={assemblies}
      />,
    );

    expect(screen.getByTestId("assembly-group-table-container")).toHaveStyle({
      overflowX: "auto",
    });
    expect(screen.getByRole("table")).toHaveStyle({
      minWidth: "640px",
    });
  });
});
