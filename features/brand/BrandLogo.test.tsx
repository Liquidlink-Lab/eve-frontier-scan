import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";
import BrandLogo from "./BrandLogo";

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
    width,
    height,
    unoptimized,
  }: {
    alt: string;
    src: string | { src: string };
    width?: number;
    height?: number;
    unoptimized?: boolean;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      src={typeof src === "string" ? src : src.src}
      width={width}
      height={height}
      data-unoptimized={String(Boolean(unoptimized))}
    />
  ),
}));

describe("BrandLogo", () => {
  it("renders the raw logo asset without extra image optimization", () => {
    renderWithProviders(<BrandLogo size={88} />);

    const image = screen.getByRole("img", { name: /eve frontier scan logo/i });

    expect(image).toHaveAttribute("src", "/brand/eve-frontier-scan-logo.jpg");
    expect(image).toHaveAttribute("width", "88");
    expect(image).toHaveAttribute("height", "88");
    expect(image).toHaveAttribute("data-unoptimized", "true");
  });
});
