import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";
import LookupPage from "./page";

const {
  fetchWalletStructureDiscovery,
  normalizeSuiAddress,
  redirect,
  resolveCharacterLookupState,
} = vi.hoisted(() => ({
  fetchWalletStructureDiscovery: vi.fn(),
  normalizeSuiAddress: vi.fn(),
  redirect: vi.fn(),
  resolveCharacterLookupState: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect,
}));

vi.mock("@/lib/eve/address", () => ({
  normalizeSuiAddress: (...args: unknown[]) => normalizeSuiAddress(...args),
}));

vi.mock("@/lib/eve/discovery/eveOwnershipClient", () => ({
  fetchWalletStructureDiscovery: (...args: unknown[]) =>
    fetchWalletStructureDiscovery(...args),
}));

vi.mock("@/features/characters/CharacterSelectionPage", () => ({
  __esModule: true,
  default: ({
    address,
    characters,
  }: {
    address: string;
    characters: unknown[];
  }) => <div data-testid="character-selection">{`${address}:${characters.length}`}</div>,
  resolveCharacterLookupState: (...args: unknown[]) =>
    resolveCharacterLookupState(...args),
}));

vi.mock("@/features/lookup/LookupEmptyState", () => ({
  __esModule: true,
  default: () => (
    <div>No EVE Frontier player record found for this address.</div>
  ),
}));

describe("LookupPage", () => {
  beforeEach(() => {
    fetchWalletStructureDiscovery.mockReset();
    normalizeSuiAddress.mockReset();
    redirect.mockReset();
    resolveCharacterLookupState.mockReset();

    normalizeSuiAddress.mockReturnValue("0xabc");
    fetchWalletStructureDiscovery.mockResolvedValue({});
  });

  it("renders the empty state when no characters are found", async () => {
    resolveCharacterLookupState.mockReturnValue({ kind: "empty" });

    const page = await LookupPage({
      params: Promise.resolve({ address: "0xAbC" }),
      searchParams: Promise.resolve({}),
    });

    renderWithProviders(page);

    expect(
      screen.getByText(/no eve frontier player record found for this address\./i),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("character-selection")).not.toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("fetches stillness data and preserves the selected world in redirects", async () => {
    resolveCharacterLookupState.mockReturnValue({
      kind: "single",
      characterId: "0xchar-1",
      redirectTo:
        "/dashboard/0xchar-1/network-nodes?wallet=0xabc&source=sui-address&world=stillness",
    });

    await LookupPage({
      params: Promise.resolve({ address: "0xAbC" }),
      searchParams: Promise.resolve({
        world: "stillness",
      }),
    });

    expect(fetchWalletStructureDiscovery).toHaveBeenCalledWith("0xabc", "stillness");
    expect(redirect).toHaveBeenCalledWith(
      "/dashboard/0xchar-1/network-nodes?wallet=0xabc&source=sui-address&world=stillness",
    );
  });
});
