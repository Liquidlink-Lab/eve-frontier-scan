import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { NetworkNodeSummary, WalletAccessContext } from "@/lib/eve/types";
import { renderWithProviders } from "@/test/renderWithProviders";
import NetworkNodeTableRow from "./NetworkNodeTableRow";

const access: WalletAccessContext = {
  source: "eve-vault",
  walletAddress: "0xwallet-1",
};

const networkNode: NetworkNodeSummary = {
  id: "0xnode-1",
  name: "Power Spine",
  iconUrl: "https://cdn.example/types/88092.png",
  systemName: "30013131",
  status: "online",
  fuelPercent: 28,
  fuelEtaMs: 3_240_000_000,
  fuelTypeId: 78437,
  fuelTypeName: "EU-90 Fuel",
  fuelTypeIconUrl: "https://cdn.example/types/78437.png",
  fuelQuantity: 999,
  connectedAssemblyCount: 5,
  connectedAssemblies: [],
};

describe("NetworkNodeTableRow", () => {
  it("renders a fuel progress bar alongside the fuel percentage", () => {
    renderWithProviders(
      <table>
        <tbody>
          <NetworkNodeTableRow
            access={access}
            characterId="0xcharacter-1"
            networkNode={networkNode}
          />
        </tbody>
      </table>,
    );

    const row = screen.getByText("Power Spine").closest("tr");

    expect(row).not.toBeNull();
    expect(within(row!).getByRole("img", { name: "Network Node icon" })).toHaveAttribute(
      "src",
      "https://cdn.example/types/88092.png",
    );
    expect(within(row!).getByRole("img", { name: "EU-90 Fuel icon" })).toHaveAttribute(
      "src",
      "https://cdn.example/types/78437.png",
    );
    expect(within(row!).getByText("EU-90 Fuel")).toBeInTheDocument();
    expect(within(row!).getByText("28%")).toBeInTheDocument();
    expect(within(row!).getByText("ETA 37d 12h")).toBeInTheDocument();
    expect(within(row!).getByRole("progressbar", { name: "Fuel level" })).toHaveAttribute(
      "aria-valuenow",
      "28",
    );
  });
});
