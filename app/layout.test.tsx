import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import RootLayout from "./layout";

vi.mock(
  "@mui/material-nextjs/v16-appRouter",
  () => ({
    AppRouterCacheProvider: ({
      children,
    }: {
      children: React.ReactNode;
    }) => <div data-testid="mui-app-router-cache-provider">{children}</div>,
  }),
  { virtual: true },
);

vi.mock("@/features/wallet/WalletMenu", () => ({
  __esModule: true,
  default: () => <div data-testid="wallet-menu" />,
}));

vi.mock("./providers", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
}));

describe("RootLayout", () => {
  it("wraps app content with the MUI App Router cache provider", () => {
    render(
      RootLayout({
        children: <div data-testid="page-content">Page content</div>,
      }),
    );

    const cacheProvider = screen.getByTestId("mui-app-router-cache-provider");

    expect(within(cacheProvider).getByTestId("providers")).toBeInTheDocument();
    expect(within(cacheProvider).getByTestId("wallet-menu")).toBeInTheDocument();
    expect(within(cacheProvider).getByTestId("page-content")).toBeInTheDocument();
  });
});
