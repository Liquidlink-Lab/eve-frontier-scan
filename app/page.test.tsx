import { screen } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";
import HomePage from "./page";

const push = vi.fn();
const mockedUseWalletSession = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

vi.mock("@/features/wallet/useWalletSession", () => ({
  useWalletSession: () => mockedUseWalletSession(),
}));

beforeEach(() => {
  push.mockReset();
  mockedUseWalletSession.mockReturnValue({
    connect: vi.fn(),
    disconnect: vi.fn(),
    hasEveVault: true,
    isConnected: false,
    shortAddress: null,
    walletAddress: null,
  });
});

it("renders a lookup-first homepage", () => {
  renderWithProviders(<HomePage />);

  expect(screen.getByRole("textbox")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /connect eve vault/i }),
  ).toBeInTheDocument();
});
