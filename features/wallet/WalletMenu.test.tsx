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
});
