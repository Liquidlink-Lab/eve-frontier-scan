import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";
import LookupEntryForm from "./LookupEntryForm";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

describe("LookupEntryForm", () => {
  beforeEach(() => {
    push.mockReset();
  });

  it("renders a direct server selector on the homepage form", () => {
    renderWithProviders(<LookupEntryForm defaultWorld="utopia" />);

    expect(screen.getByText("Server")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /utopia/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /stillness/i })).toBeInTheDocument();
  });

  it("preserves the selected world when submitting a wallet lookup", async () => {
    const user = userEvent.setup();

    renderWithProviders(<LookupEntryForm defaultWorld="utopia" />);

    await user.click(screen.getByRole("button", { name: /stillness/i }));

    await user.type(screen.getByRole("textbox", { name: /sui address/i }), " 0xAbCdEf1234 ");
    await user.click(screen.getByRole("button", { name: /inspect wallet/i }));

    expect(push).toHaveBeenCalledWith("/lookup/0xabcdef1234?world=stillness");
  });
});
