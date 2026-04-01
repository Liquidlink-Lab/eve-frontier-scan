import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { collectHydrationRecoverableErrors } from "@/test/hydration";
import { renderWithProviders } from "@/test/renderWithProviders";
import DashboardSearchForm from "./DashboardSearchForm";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

describe("DashboardSearchForm", () => {
  beforeEach(() => {
    setViewportWidth(1280);
  });

  it("renders a centered compact search form", () => {
    renderWithProviders(<DashboardSearchForm world="utopia" />);

    const textbox = screen.getByRole("textbox", {
      name: /inspect another address/i,
    });
    const form = textbox.closest("form");
    const inspectButton = screen.getByRole("button", {
      name: /inspect another address/i,
    });

    expect(form).not.toBeNull();
    expect(form).toHaveStyle({
      marginLeft: "auto",
      marginRight: "auto",
      flexDirection: "row",
    });
    expect(textbox).toHaveClass("MuiInputBase-inputSizeSmall");
    expect(textbox).toHaveAttribute("placeholder", "0x...");
    expect(inspectButton).toHaveClass("MuiButton-sizeSmall");
    expect(inspectButton).toHaveTextContent(/inspect/i);
  });

  it("keeps the mobile form accessible while using the compact submit icon", () => {
    setViewportWidth(390);

    renderWithProviders(<DashboardSearchForm world="utopia" />);

    const textbox = screen.getByRole("textbox", {
      name: /inspect another address/i,
    });
    const form = textbox.closest("form");

    expect(form).not.toBeNull();
    expect(form).toHaveStyle({
      flexDirection: "row",
    });
    expect(textbox).toHaveAttribute("placeholder", "0x...");
    expect(screen.getByTestId("SearchRoundedIcon")).toBeInTheDocument();
  });

  it("hydrates without recoverable errors on mobile", async () => {
    const recoverableErrors = await collectHydrationRecoverableErrors({
      ui: <DashboardSearchForm world="utopia" />,
      beforeServerRender: () => {
        Reflect.deleteProperty(window, "matchMedia");
      },
      beforeHydrate: () => {
        setViewportWidth(390);
      },
    });

    expect(recoverableErrors).toEqual([]);
  });

  it("preserves the selected world when routing to a new lookup", async () => {
    const user = userEvent.setup();

    renderWithProviders(<DashboardSearchForm world="stillness" />);

    await user.type(
      screen.getByRole("textbox", { name: /inspect another address/i }),
      " 0xAbCdEf1234 ",
    );
    await user.click(screen.getByRole("button", { name: /inspect another address/i }));

    expect(push).toHaveBeenCalledWith("/lookup/0xabcdef1234?world=stillness");
  });
});

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  });

  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: evaluateMediaQuery(query, width),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

function evaluateMediaQuery(query: string, width: number) {
  const minMatch = query.match(/\(min-width:\s*(\d+)px\)/);
  const maxMatch = query.match(/\(max-width:\s*(\d+(?:\.\d+)?)px\)/);

  if (minMatch) {
    return width >= Number(minMatch[1]);
  }

  if (maxMatch) {
    return width <= Number(maxMatch[1]);
  }

  return false;
}
