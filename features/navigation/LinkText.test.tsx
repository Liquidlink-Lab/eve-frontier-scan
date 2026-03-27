import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";
import LinkText from "./LinkText";

describe("LinkText", () => {
  it("renders an internal navigation text link with an href", () => {
    renderWithProviders(
      <LinkText href="/dashboard/0xchar-1/network-nodes/0xnode-1">
        Power Spine
      </LinkText>,
    );

    expect(screen.getByRole("link", { name: "Power Spine" })).toHaveAttribute(
      "href",
      "/dashboard/0xchar-1/network-nodes/0xnode-1",
    );
  });
});
