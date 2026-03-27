import * as React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";
import DashboardRefreshButton from "./DashboardRefreshButton";

const { refresh, pendingState } = vi.hoisted(() => ({
  refresh: vi.fn(),
  pendingState: { current: false },
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof React>("react");

  return {
    ...actual,
    useTransition: () =>
      [pendingState.current, (callback: () => void) => callback()] as const,
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh,
  }),
}));

describe("DashboardRefreshButton", () => {
  beforeEach(() => {
    refresh.mockReset();
    pendingState.current = false;
  });

  it("refreshes the current route when clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(<DashboardRefreshButton />);

    await user.click(screen.getByRole("button", { name: /^refresh$/i }));

    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("shows a pending state while a refresh transition is active", () => {
    pendingState.current = true;

    renderWithProviders(<DashboardRefreshButton />);

    expect(screen.getByRole("button", { name: /refreshing/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /refreshing/i })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });
});
