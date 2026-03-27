import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";
import DashboardLoadingState from "./DashboardLoadingState";

describe("DashboardLoadingState", () => {
  it("renders an accessible loading status with navigation and content skeletons", () => {
    renderWithProviders(<DashboardLoadingState />);

    expect(
      screen.getByRole("status", { name: /loading dashboard view/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-loading-navigation")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-loading-content")).toBeInTheDocument();
  });
});
