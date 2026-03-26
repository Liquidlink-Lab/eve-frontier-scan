import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";
import CharacterSwitcher from "./CharacterSwitcher";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
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
            currentShipName: null,
          },
        ]}
        currentCharacterId="0xchar-1"
      />,
    );

    expect(screen.getByText("Character")).not.toHaveAttribute("data-shrink");
    expect(screen.getByRole("combobox", { name: /character/i })).toHaveValue("0xchar-1");
  });
});
