import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";
import CharacterSwitcher from "./CharacterSwitcher";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

describe("CharacterSwitcher", () => {
  it("renders a static label above the select instead of a floating input label", () => {
    const { rerender } = renderWithProviders(
      <CharacterSwitcher
        access={{
          source: "eve-vault",
          walletAddress: "0xwallet-1",
        }}
        characters={[]}
        currentCharacterId="0xchar-1"
      />,
    );

    rerender(
      <CharacterSwitcher
        access={{
          source: "eve-vault",
          walletAddress: "0xwallet-1",
        }}
        characters={[
          {
            id: "0xchar-1",
            name: "Rhea Ancru",
            tribeName: "Caldari",
            walletAddress: "0xwallet-1",
            walletSource: "eve-vault",
            walletSourceLabel: "Connected EVE Vault",
            networkNodeCount: 1,
            ownedStructureCount: 1,
            defaultDashboardSection: "network-nodes",
            currentShipName: null,
          },
        ]}
        currentCharacterId="0xchar-1"
      />,
    );

    expect(screen.getByText("Character")).not.toHaveAttribute("data-shrink");
    expect(screen.getByRole("combobox", { name: /character/i })).toHaveValue("0xchar-1");
  });

  it("routes assembly-only characters to the assemblies dashboard", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <CharacterSwitcher
        access={{
          source: "eve-vault",
          walletAddress: "0xwallet-1",
        }}
        characters={[
          {
            id: "0xchar-1",
            name: "Rhea Ancru",
            tribeName: "Caldari",
            walletAddress: "0xwallet-1",
            walletSource: "eve-vault",
            walletSourceLabel: "Connected EVE Vault",
            networkNodeCount: 1,
            ownedStructureCount: 1,
            defaultDashboardSection: "network-nodes",
            currentShipName: null,
          },
          {
            id: "0xchar-2",
            name: "NbulaComplx",
            tribeName: "Caldari",
            walletAddress: "0xwallet-1",
            walletSource: "eve-vault",
            walletSourceLabel: "Connected EVE Vault",
            networkNodeCount: 0,
            ownedStructureCount: 3,
            defaultDashboardSection: "assemblies",
            currentShipName: null,
          },
        ]}
        currentCharacterId="0xchar-1"
      />,
    );

    await user.selectOptions(screen.getByRole("combobox", { name: /character/i }), "0xchar-2");

    expect(push).toHaveBeenCalledWith(
      "/dashboard/0xchar-2/assemblies?wallet=0xwallet-1&source=eve-vault",
    );
  });
});
