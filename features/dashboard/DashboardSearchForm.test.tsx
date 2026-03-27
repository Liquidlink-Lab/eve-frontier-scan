import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

  it("renders a centered compact search form that stays inline on mobile", () => {
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
      flexDirection: "row",
    });
    expect(textbox).toHaveClass("MuiInputBase-inputSizeSmall");
    expect(inspectButton).toHaveClass("MuiButton-sizeMedium");
    expect(inspectButton).toHaveStyle({
      width: "auto",
      minWidth: "96px",
      flexShrink: "0",
    });
  });

  it("uses a tighter mobile layout with a compact icon submit button", () => {
    setViewportWidth(390);

    renderWithProviders(<DashboardSearchForm />);

    const textbox = screen.getByRole("textbox", {
      name: /inspect another address/i,
    });
    const form = textbox.closest("form");
    const inspectButton = screen.getByRole("button", {
      name: /inspect address/i,
    });

    expect(form).not.toBeNull();
    expect(form).toHaveStyle({
      flexDirection: "row",
    });
    expect(textbox).toHaveAttribute("placeholder", "Address");
    expect(inspectButton).toHaveStyle({
      minWidth: "40px",
      paddingLeft: "0px",
      paddingRight: "0px",
    });
    expect(inspectButton).not.toHaveTextContent(/inspect/i);
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
