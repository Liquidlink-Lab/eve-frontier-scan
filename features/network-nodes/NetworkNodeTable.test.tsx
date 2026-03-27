import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { NetworkNodeSummary, WalletAccessContext } from "@/lib/eve/types";
import { renderWithProviders } from "@/test/renderWithProviders";
import NetworkNodeTable from "./NetworkNodeTable";

const access: WalletAccessContext = {
  source: "eve-vault",
  walletAddress: "0xwallet-1",
};

const networkNodes: NetworkNodeSummary[] = [
  {
    id: "0xnode-1",
    name: "Power Spine",
    iconUrl: "https://cdn.example/types/88092.png",
    systemName: "30013131",
    status: "online",
    fuelPercent: 28,
    fuelEtaMs: 3_240_000_000,
    fuelQuantity: 999,
    connectedAssemblyCount: 5,
    connectedAssemblies: [],
  },
];

describe("NetworkNodeTable", () => {
  it("keeps the table horizontally scrollable on narrow screens", () => {
    renderWithProviders(
      <NetworkNodeTable
        access={access}
        characterId="0xcharacter-1"
        networkNodes={networkNodes}
      />,
    );

    expect(screen.getByTestId("network-node-table-container")).toHaveStyle({
      overflowX: "auto",
    });
    expect(screen.getByRole("table")).toHaveStyle({
      minWidth: "720px",
    });
  });
});
