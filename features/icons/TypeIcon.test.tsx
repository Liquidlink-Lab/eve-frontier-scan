import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";
import TypeIcon from "./TypeIcon";

describe("TypeIcon", () => {
  it("renders a remote world type image when an icon url is present", () => {
    renderWithProviders(
      <TypeIcon
        iconUrl="https://cdn.example/types/77917.png"
        label="Heavy Storage"
        size={32}
      />,
    );

    expect(screen.getByRole("img", { name: "Heavy Storage icon" })).toHaveAttribute(
      "src",
      "https://cdn.example/types/77917.png",
    );
  });

  it("renders a labeled fallback badge when there is no icon url", () => {
    renderWithProviders(<TypeIcon iconUrl={null} label="Field Refinery" size={32} />);

    expect(screen.getByLabelText("Field Refinery icon fallback")).toHaveTextContent("FI");
  });
});
