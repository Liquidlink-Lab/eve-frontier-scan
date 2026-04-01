import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { collectHydrationRecoverableErrors } from "@/test/hydration";
import { renderWithProviders } from "@/test/renderWithProviders";
import WalletMenu from "./WalletMenu";

const push = vi.fn();
const replace = vi.fn();
const connect = vi.fn();
const disconnect = vi.fn();
const mockedUseWalletSession = vi.fn();
const usePathname = vi.fn();
const useSearchParams = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    replace,
  }),
  usePathname: () => usePathname(),
  useSearchParams: () => useSearchParams(),
}));

vi.mock("./useWalletSession", () => ({
  useWalletSession: () => mockedUseWalletSession(),
}));

describe("WalletMenu", () => {
  beforeEach(() => {
    setViewportWidth(1280);
    push.mockReset();
    replace.mockReset();
    connect.mockReset();
    disconnect.mockReset();
    usePathname.mockReset();
    useSearchParams.mockReset();
    usePathname.mockReturnValue("/dashboard/0xchar-1/network-nodes");
    useSearchParams.mockReturnValue(
      new URLSearchParams({
        wallet: "0x1234567890abcd",
        source: "eve-vault",
        world: "stillness",
      }),
    );
    mockedUseWalletSession.mockReturnValue({
      connect,
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
    expect(push).toHaveBeenCalledWith("/me?world=stillness");

    await user.click(screen.getByRole("button", { name: /0x1234…abcd/i }));
    await user.click(screen.getByRole("menuitem", { name: /disconnect/i }));
    expect(disconnect).toHaveBeenCalled();
  });

  it("renders the server switcher at the top of the wallet menu and updates the current route", async () => {
    const user = userEvent.setup();

    renderWithProviders(<WalletMenu />);

    await user.click(
      screen.getByRole("button", { name: /0x1234…abcd/i }),
    );

    expect(screen.getByText("Server")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /utopia/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /stillness/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: /utopia/i }));

    expect(replace).toHaveBeenCalledWith(
      "/dashboard/0xchar-1/network-nodes?wallet=0x1234567890abcd&source=eve-vault",
    );
  });

  it("lets disconnected users switch server before connecting a wallet", async () => {
    const user = userEvent.setup();

    usePathname.mockReturnValue("/me");
    useSearchParams.mockReturnValue(new URLSearchParams());
    mockedUseWalletSession.mockReturnValue({
      connect,
      disconnect: vi.fn(),
      hasEveVault: true,
      isConnected: false,
      shortAddress: null,
      walletAddress: null,
    });

    renderWithProviders(<WalletMenu />);

    await user.click(
      screen.getByRole("button", { name: /connect eve vault/i }),
    );

    expect(screen.getByText("Server")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /utopia/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.getByRole("menuitem", { name: /connect eve vault/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /stillness/i }));

    expect(replace).toHaveBeenCalledWith("/me?world=stillness");
  });

  it("keeps server switching available when EVE Vault is unavailable", async () => {
    const user = userEvent.setup();

    mockedUseWalletSession.mockReturnValue({
      connect,
      disconnect: vi.fn(),
      hasEveVault: false,
      isConnected: false,
      shortAddress: null,
      walletAddress: null,
    });

    renderWithProviders(<WalletMenu />);

    await user.click(
      screen.getByRole("button", { name: /connect eve vault/i }),
    );

    expect(screen.getByText("Server")).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /connect eve vault/i }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("compacts the connect control on mobile", () => {
    setViewportWidth(390);
    mockedUseWalletSession.mockReturnValue({
      connect,
      disconnect: vi.fn(),
      hasEveVault: true,
      isConnected: false,
      shortAddress: null,
      walletAddress: null,
    });

    renderWithProviders(<WalletMenu />);

    const button = screen.getByRole("button", { name: /connect eve vault/i });

    expect(button).toHaveClass("MuiButton-sizeSmall");
    expect(screen.getByTestId("AccountBalanceWalletRoundedIcon")).toBeInTheDocument();
  });

  it("hydrates without recoverable errors on mobile", async () => {
    mockedUseWalletSession.mockReturnValue({
      connect,
      disconnect: vi.fn(),
      hasEveVault: true,
      isConnected: false,
      shortAddress: null,
      walletAddress: null,
    });

    const recoverableErrors = await collectHydrationRecoverableErrors({
      ui: <WalletMenu />,
      beforeServerRender: () => {
        Reflect.deleteProperty(window, "matchMedia");
      },
      beforeHydrate: () => {
        setViewportWidth(390);
      },
    });

    expect(recoverableErrors).toEqual([]);
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
