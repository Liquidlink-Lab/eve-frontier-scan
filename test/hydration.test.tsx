import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("react-dom/client", async () => {
  const actual = await vi.importActual<typeof import("react-dom/client")>(
    "react-dom/client",
  );

  return {
    ...actual,
    hydrateRoot: vi.fn(),
  };
});

import { hydrateRoot } from "react-dom/client";

import { collectHydrationRecoverableErrors } from "@/test/hydration";

describe("collectHydrationRecoverableErrors", () => {
  afterEach(() => {
    vi.mocked(hydrateRoot).mockReset();
  });

  it("collects string recoverable errors from hydrateRoot", async () => {
    const unmount = vi.fn();

    vi.mocked(hydrateRoot).mockImplementation((_container, _ui, options) => {
      options?.onRecoverableError?.("Hydration text mismatch", {
        componentStack: "",
      });

      return {
        unmount,
      };
    });

    const recoverableErrors = await collectHydrationRecoverableErrors({
      ui: <div>hydration test</div>,
    });

    expect(recoverableErrors).toEqual(["Hydration text mismatch"]);
    expect(unmount).toHaveBeenCalledTimes(1);
  });
});
