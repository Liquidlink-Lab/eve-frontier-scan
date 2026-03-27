import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";
import DashboardSearchForm from "./DashboardSearchForm";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

describe("DashboardSearchForm", () => {
  it("renders a centered compact search form with a large inspect action", () => {
    renderWithProviders(<DashboardSearchForm />);

    const textbox = screen.getByRole("textbox", {
      name: /inspect another address/i,
    });
    const form = textbox.closest("form");
    const inspectButton = screen.getByRole("button", { name: /^inspect$/i });

    expect(form).not.toBeNull();
    expect(form).toHaveStyle({
      marginLeft: "auto",
      marginRight: "auto",
    });
    expect(textbox).toHaveClass("MuiInputBase-inputSizeSmall");
    expect(inspectButton).toHaveClass("MuiButton-sizeLarge");
  });
});
