import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";
import ConnectWalletButton from "./ConnectWalletButton";

const mockedUseWalletSession = vi.fn();

vi.mock("@/features/wallet/useWalletSession", () => ({
  useWalletSession: () => mockedUseWalletSession(),
}));

describe("ConnectWalletButton", () => {
  it("keeps the connect label when EVE Vault is not yet available", () => {
    mockedUseWalletSession.mockReturnValue({
      connect: vi.fn(),
      disconnect: vi.fn(),
      hasEveVault: false,
      isConnected: false,
      shortAddress: null,
      walletAddress: null,
    });

    renderWithProviders(<ConnectWalletButton />);

    expect(
      screen.getByRole("button", { name: /connect eve vault/i }),
    ).toBeDisabled();
  });
});
