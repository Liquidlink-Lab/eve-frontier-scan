import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";
import DetailField from "./DetailField";

describe("DetailField", () => {
  it("stacks label and value on mobile while allowing long values to wrap safely", () => {
    renderWithProviders(
      <DetailField label="Extension">
        <span>0xextension::some_really_long_module_path::ExtensionConfig</span>
      </DetailField>,
    );

    expect(screen.getByTestId("dashboard-detail-field")).toHaveStyle({
      flexDirection: "column",
      alignItems: "flex-start",
    });
    expect(screen.getByTestId("dashboard-detail-field-value")).toHaveStyle({
      width: "100%",
      textAlign: "left",
      wordBreak: "break-word",
    });
  });
});
