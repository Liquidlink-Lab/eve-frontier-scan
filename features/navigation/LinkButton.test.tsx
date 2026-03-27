import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";
import LinkButton from "./LinkButton";

describe("LinkButton", () => {
  it("renders an internal navigation button as a link with an href", () => {
    renderWithProviders(
      <LinkButton href="/dashboard/0xchar-1/network-nodes" size="small">
        Details
      </LinkButton>,
    );

    expect(screen.getByRole("link", { name: "Details" })).toHaveAttribute(
      "href",
      "/dashboard/0xchar-1/network-nodes",
    );
  });
});
