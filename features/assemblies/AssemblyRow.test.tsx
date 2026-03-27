import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { AssemblySummary, WalletAccessContext } from "@/lib/eve/types";
import { renderWithProviders } from "@/test/renderWithProviders";
import AssemblyRow from "./AssemblyRow";

const access: WalletAccessContext = {
  source: "eve-vault",
  walletAddress: "0xwallet-1",
};

const assembly: AssemblySummary = {
  id: "0xstorage-1",
  name: "Vault Alpha",
  iconUrl: "https://cdn.example/types/77917.png",
  systemName: "30013131",
  status: "online",
  typeId: 77917,
  typeLabel: "Heavy Storage",
  typeRepr: "0xpkg::storage_unit::StorageUnit",
};

describe("AssemblyRow", () => {
  it("renders a structure icon beside the assembly name", () => {
    renderWithProviders(
      <table>
        <tbody>
          <AssemblyRow
            access={access}
            characterId="0xcharacter-1"
            assembly={assembly}
          />
        </tbody>
      </table>,
    );

    const row = screen.getByText("Vault Alpha").closest("tr");

    expect(row).not.toBeNull();
    expect(
      within(row!).getByRole("img", { name: "Heavy Storage icon" }),
    ).toHaveAttribute("src", "https://cdn.example/types/77917.png");
  });
});
