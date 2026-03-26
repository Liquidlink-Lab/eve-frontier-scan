import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import HomePage from "@/app/page";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

describe("HomePage", () => {
  beforeEach(() => {
    push.mockReset();
  });

  it("renders a lookup-first homepage without dashboard navigation or marketing copy", () => {
    render(<HomePage />);

    expect(screen.getByText("EVE Frontier Scan")).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /sui address/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /connect eve vault/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/looking for a starting point/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/deploy now/i)).not.toBeInTheDocument();
  });

  it("normalizes the entered address and routes to lookup on submit", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.type(
      screen.getByRole("textbox", { name: /sui address/i }),
      " 0xAbCdEf1234 ",
    );
    await user.click(screen.getByRole("button", { name: /inspect wallet/i }));

    expect(push).toHaveBeenCalledWith("/lookup/0xabcdef1234");
  });
});
