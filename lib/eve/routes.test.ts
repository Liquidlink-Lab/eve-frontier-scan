import { describe, expect, it } from "vitest";

import {
  buildDashboardNetworkNodesHref,
  parseWalletAccessSearchParams,
} from "./routes";

describe("eve routes", () => {
  it("preserves the selected world in dashboard links", () => {
    expect(
      buildDashboardNetworkNodesHref("0xchar-1", {
        walletAddress: "0xwallet-1",
        source: "sui-address",
        world: "stillness",
      }),
    ).toBe(
      "/dashboard/0xchar-1/network-nodes?wallet=0xwallet-1&source=sui-address&world=stillness",
    );
  });

  it("defaults missing world search params to utopia", () => {
    expect(
      parseWalletAccessSearchParams(
        new URLSearchParams({
          wallet:
            "0x43acdc9cb9e379d5fab90effbaaa08896d943d9958a96d9df6f07c39025cd186",
          source: "eve-vault",
        }),
      ),
    ).toEqual({
      walletAddress:
        "0x43acdc9cb9e379d5fab90effbaaa08896d943d9958a96d9df6f07c39025cd186",
      source: "eve-vault",
      world: "utopia",
    });
  });
});
