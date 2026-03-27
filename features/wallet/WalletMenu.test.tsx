import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";
import WalletMenu from "./WalletMenu";

const push = vi.fn();
const disconnect = vi.fn();
const mockedUseWalletSession = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

vi.mock("./useWalletSession", () => ({
  useWalletSession: () => mockedUseWalletSession(),
}));

describe("WalletMenu", () => {
  beforeEach(() => {
    setViewportWidth(1280);
    push.mockReset();
    disconnect.mockReset();
    mockedUseWalletSession.mockReturnValue({
      connect: vi.fn(),
      disconnect,
      hasEveVault: true,
      isConnected: true,
      shortAddress: "0x1234…abcd",
      walletAddress: "0x1234567890abcd",
    });
  });

  it("shows the connected wallet menu with dashboard and disconnect actions", async () => {
    const user = userEvent.setup();

    renderWithProviders(<WalletMenu />);

    await user.click(
      screen.getByRole("button", { name: /0x1234…abcd/i }),
    );

    expect(screen.getByRole("menuitem", { name: /my dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /disconnect/i })).toBeInTheDocument();

    await user.click(screen.getByRole("menuitem", { name: /my dashboard/i }));
    expect(push).toHaveBeenCalledWith("/me");

    await user.click(screen.getByRole("button", { name: /0x1234…abcd/i }));
    await user.click(screen.getByRole("menuitem", { name: /disconnect/i }));
    expect(disconnect).toHaveBeenCalled();
  });

  it("keeps the connect label when EVE Vault is unavailable", () => {
    mockedUseWalletSession.mockReturnValue({
      connect: vi.fn(),
      disconnect: vi.fn(),
      hasEveVault: false,
      isConnected: false,
      shortAddress: null,
      walletAddress: null,
    });

    renderWithProviders(<WalletMenu />);

    expect(
      screen.getByRole("button", { name: /connect eve vault/i }),
    ).toBeDisabled();
  });

  it("compacts the connect control on mobile", () => {
    setViewportWidth(390);
    mockedUseWalletSession.mockReturnValue({
      connect: vi.fn(),
      disconnect: vi.fn(),
      hasEveVault: true,
      isConnected: false,
      shortAddress: null,
      walletAddress: null,
    });

    renderWithProviders(<WalletMenu />);

    const button = screen.getByRole("button", { name: /connect eve vault/i });

    expect(button).toHaveStyle({
      minWidth: "40px",
    });
    expect(button).not.toHaveTextContent(/connect eve vault/i);
  });
});

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  });

  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: evaluateMediaQuery(query, width),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

function evaluateMediaQuery(query: string, width: number) {
  const minMatch = query.match(/\(min-width:\s*(\d+)px\)/);
  const maxMatch = query.match(/\(max-width:\s*(\d+(?:\.\d+)?)px\)/);

  if (minMatch) {
    return width >= Number(minMatch[1]);
  }

  if (maxMatch) {
    return width <= Number(maxMatch[1]);
  }

  return false;
}
