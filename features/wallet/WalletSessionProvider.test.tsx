import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";
import WalletSessionProvider from "./WalletSessionProvider";
import { useWalletSession } from "./useWalletSession";

const useCurrentAccount = vi.fn();
const useDAppKit = vi.fn();
const useWallets = vi.fn();

vi.mock("@mysten/dapp-kit-react", () => ({
  useCurrentAccount: () => useCurrentAccount(),
  useDAppKit: () => useDAppKit(),
  useWallets: () => useWallets(),
}));

function WalletSessionProbe() {
  const walletSession = useWalletSession();

  return (
    <div>{walletSession.hasEveVault ? "vault-detected" : "vault-missing"}</div>
  );
}

describe("WalletSessionProvider", () => {
  it("detects Eve Vault when the wallet uses the official product casing", () => {
    useCurrentAccount.mockReturnValue(null);
    useDAppKit.mockReturnValue({
      connectWallet: vi.fn(),
      disconnectWallet: vi.fn(),
    });
    useWallets.mockReturnValue([
      {
        name: "Eve Vault",
        version: "1.0.0",
      },
    ]);

    renderWithProviders(
      <WalletSessionProvider>
        <WalletSessionProbe />
      </WalletSessionProvider>,
    );

    expect(screen.getByText("vault-detected")).toBeInTheDocument();
  });
});
