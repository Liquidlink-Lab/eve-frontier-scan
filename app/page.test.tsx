import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import HomePage from "./page";

it("renders a lookup-first homepage", () => {
  render(<HomePage />);

  expect(screen.getByRole("textbox")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /connect eve vault/i }),
  ).toBeInTheDocument();
});
