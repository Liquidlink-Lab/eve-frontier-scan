import { screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";
import MyDashboardPage from "./page";

vi.mock("@/features/dashboard/MyDashboardEntryPage", () => ({
  __esModule: true,
  default: ({ world }: { world: string }) => (
    <div data-testid="my-dashboard-entry-page">{world}</div>
  ),
}));

it("passes the selected world into the dashboard entry flow", async () => {
  const page = await MyDashboardPage({
    searchParams: Promise.resolve({
      world: "stillness",
    }),
  });

  renderWithProviders(page);

  expect(screen.getByTestId("my-dashboard-entry-page")).toHaveTextContent("stillness");
});
