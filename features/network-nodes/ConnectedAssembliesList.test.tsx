import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ConnectedAssemblyGroup, WalletAccessContext } from "@/lib/eve/types";
import { renderWithProviders } from "@/test/renderWithProviders";
import ConnectedAssembliesList from "./ConnectedAssembliesList";

const access: WalletAccessContext = {
  source: "eve-vault",
  walletAddress: "0xwallet-1",
};

const groups: ConnectedAssemblyGroup[] = [
  {
    label: "Gate",
    assemblies: [
      {
        id: "0xgate-1",
        name: "Argent Gate",
        typeLabel: "Heavy Gate",
        status: "online",
      },
      {
        id: "0xgate-2",
        name: "Breach Gate",
        typeLabel: "Heavy Gate",
        status: "offline",
      },
    ],
  },
];

describe("ConnectedAssembliesList", () => {
  it("renders online related assemblies with a success-colored status chip", () => {
    renderWithProviders(<ConnectedAssembliesList access={access} groups={groups} />);

    const onlineAssembly = screen.getByText("Argent Gate").closest("li");
    const offlineAssembly = screen.getByText("Breach Gate").closest("li");

    expect(onlineAssembly).not.toBeNull();
    expect(offlineAssembly).not.toBeNull();

    const onlineChip = within(onlineAssembly!).getByText("online").closest(".MuiChip-root");
    const offlineChip = within(offlineAssembly!).getByText("offline").closest(
      ".MuiChip-root",
    );

    expect(onlineChip).toHaveClass("MuiChip-colorSuccess");
    expect(offlineChip).not.toHaveClass("MuiChip-colorSuccess");
  });
});
