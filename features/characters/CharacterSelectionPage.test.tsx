import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { WalletStructureDiscovery } from "@/lib/eve/types";
import { renderWithProviders } from "@/test/renderWithProviders";
import CharacterSelectionPage, {
  resolveCharacterLookupState,
} from "./CharacterSelectionPage";

const access = {
  source: "sui-address",
  walletAddress: "0xwallet-1",
} as const;

const lookups = {
  tribeNames: new Map([
    [3, "Caldari"],
    [4, "Minmatar"],
  ]),
  typeNames: new Map([[88092, "Network Node"]]),
};

function createDiscovery(
  characters: WalletStructureDiscovery["characters"],
): WalletStructureDiscovery {
  return {
    walletAddress: "0xwallet-1",
    characters,
  };
}

describe("resolveCharacterLookupState", () => {
  it("returns an empty outcome when the wallet has no characters", () => {
    const state = resolveCharacterLookupState(createDiscovery([]), access, lookups);

    expect(state).toEqual({
      kind: "empty",
    });
  });

  it("returns a direct dashboard redirect when the wallet resolves to one character", () => {
    const state = resolveCharacterLookupState(
      createDiscovery([
        {
          characterId: "0xchar-1",
          character: {
            id: "0xchar-1",
            name: "Rhea Ancru",
            tribeId: 3,
            ownerCapId: "0xcap-1",
          },
          playerProfileIds: ["0xprofile-1"],
          ownedStructures: [
            {
              id: "0xnode-1",
              typeId: 88092,
              typeLabel: "Network Node",
              typeRepr: "0xpkg::network_node::NetworkNode",
              name: "Power Spine",
              ownerCapId: "0xcap-1",
              status: "online",
              fuelPercent: 50,
              fuelQuantity: 5,
              connectedAssemblyIds: [],
            },
          ],
        },
      ]),
      access,
      lookups,
    );

    expect(state).toEqual({
      kind: "single",
      characterId: "0xchar-1",
      redirectTo: "/dashboard/0xchar-1/network-nodes?wallet=0xwallet-1&source=sui-address",
    });
  });

  it("defaults to the assemblies dashboard when a character has owned structures but no network nodes", () => {
    const state = resolveCharacterLookupState(
      createDiscovery([
        {
          characterId: "0xchar-2",
          character: {
            id: "0xchar-2",
            name: "NbulaComplx",
            tribeId: 3,
            ownerCapId: "0xcap-2",
          },
          playerProfileIds: ["0xprofile-2"],
          ownedStructures: [
            {
              id: "0xassembly-1",
              typeId: 87119,
              typeLabel: "Assembly",
              typeRepr: "0xpkg::assembly::Assembly",
              name: "Assembly Prime",
              ownerCapId: "0xcap-2",
              status: "online",
              fuelPercent: null,
              fuelQuantity: null,
              connectedAssemblyIds: [],
            },
          ],
        },
      ]),
      access,
      lookups,
    );

    expect(state).toEqual({
      kind: "single",
      characterId: "0xchar-2",
      redirectTo: "/dashboard/0xchar-2/assemblies?wallet=0xwallet-1&source=sui-address",
    });
  });

  it("renders a selection page when the wallet resolves to multiple characters", () => {
    const state = resolveCharacterLookupState(
      createDiscovery([
        {
          characterId: "0xchar-1",
          character: {
            id: "0xchar-1",
            name: "Rhea Ancru",
            tribeId: 3,
            ownerCapId: "0xcap-1",
          },
          playerProfileIds: ["0xprofile-1"],
          ownedStructures: [
            {
              id: "0xnode-1",
              typeId: 88092,
              typeLabel: "Network Node",
              typeRepr: "0xpkg::network_node::NetworkNode",
              name: "Power Spine",
              ownerCapId: "0xcap-1",
              status: "online",
              fuelPercent: 50,
              fuelQuantity: 5,
              connectedAssemblyIds: [],
            },
          ],
        },
        {
          characterId: "0xchar-2",
          character: {
            id: "0xchar-2",
            name: "Rhea Ancru",
            tribeId: 3,
            ownerCapId: "0xcap-2",
          },
          playerProfileIds: ["0xprofile-2"],
          ownedStructures: [
            {
              id: "0xassembly-2",
              typeId: 87119,
              typeLabel: "Assembly",
              typeRepr: "0xpkg::assembly::Assembly",
              name: "Assembly Beta",
              ownerCapId: "0xcap-2",
              status: "online",
              fuelPercent: null,
              fuelQuantity: null,
              connectedAssemblyIds: [],
            },
          ],
        },
      ]),
      access,
      lookups,
    );

    expect(state.kind).toBe("multiple");

    if (state.kind !== "multiple") {
      throw new Error("Expected multiple character state");
    }

    renderWithProviders(
      <CharacterSelectionPage
        access={access}
        address="0xwallet-1"
        characters={state.characters}
      />,
    );

    expect(screen.getAllByText("Rhea Ancru")).toHaveLength(2);
    expect(screen.getAllByText("Caldari")).toHaveLength(2);
    expect(screen.getAllByText(/sui address/i)).toHaveLength(2);
    expect(screen.getByText("1 Network Node")).toBeInTheDocument();
    expect(screen.getAllByText("1 Owned Structure")).toHaveLength(2);
    expect(screen.getByText("Character ID 0xchar-1")).toBeInTheDocument();
    expect(screen.getByText("Character ID 0xchar-2")).toBeInTheDocument();
    expect(screen.getAllByText("Ship data unavailable")).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: /open dashboard/i })[0]).toHaveAttribute(
      "href",
      "/dashboard/0xchar-1/network-nodes?wallet=0xwallet-1&source=sui-address",
    );
    expect(screen.getAllByRole("link", { name: /open dashboard/i })[1]).toHaveAttribute(
      "href",
      "/dashboard/0xchar-2/assemblies?wallet=0xwallet-1&source=sui-address",
    );
  });
});
