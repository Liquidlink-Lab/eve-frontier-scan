import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";
import WorldSwitcher from "./WorldSwitcher";

describe("WorldSwitcher", () => {
  it("renders the current selected world", () => {
    renderWithProviders(<WorldSwitcher value="stillness" onChange={vi.fn()} />);

    expect(screen.getByText("Server")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /stillness/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("notifies the parent when the selected world changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderWithProviders(<WorldSwitcher value="utopia" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /stillness/i }));

    expect(onChange).toHaveBeenCalledWith("stillness");
  });
});
