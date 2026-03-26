import { screen } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";
import HomePage from "./page";

const { push, redirect } = vi.hoisted(() => ({
  push: vi.fn(),
  redirect: vi.fn(),
}));
const mockedUseWalletSession = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
  redirect,
}));

vi.mock("@/features/wallet/useWalletSession", () => ({
  useWalletSession: () => mockedUseWalletSession(),
}));

beforeEach(() => {
  push.mockReset();
  redirect.mockReset();
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
