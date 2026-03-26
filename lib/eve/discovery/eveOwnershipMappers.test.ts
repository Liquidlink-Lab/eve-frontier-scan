import { describe, expect, it } from "vitest";

const access = {
  source: "sui-address",
  walletAddress: "0xwallet-1",
} as const;

const discovery = {
  walletAddress: "0xwallet-1",
  characters: [
    {
      characterId: "0xchar-1",
      character: {
        id: "0xchar-1",
        name: "Rhea Ancru",
        tribeId: 3,
        ownerCapId: "0xowner-cap-1",
      },
      playerProfileIds: ["0xprofile-1"],
      ownedStructures: [
        {
          id: "0xnode-1",
          typeId: 88092,
          typeLabel: "Network Node",
          typeRepr: "0xpkg::network_node::NetworkNode",
          name: "Power Spine",
          ownerCapId: "0xowner-cap-1",
          status: "online",
          fuelPercent: 60,
          fuelQuantity: 6,
          connectedAssemblyIds: ["0xstorage-1"],
        },
        {
          id: "0xstorage-1",
          typeId: 77917,
          typeLabel: "Storage Unit",
          typeRepr: "0xpkg::storage_unit::StorageUnit",
          name: "Vault Alpha",
          ownerCapId: "0xowner-cap-1",
          status: "online",
          fuelPercent: null,
          fuelQuantity: null,
          connectedAssemblyIds: [],
        },
        {
          id: "0xrefinery-1",
          typeId: 88064,
          typeLabel: "Assembly",
          typeRepr: "0xpkg::assembly::Assembly",
          name: "Refinery One",
          ownerCapId: "0xowner-cap-1",
          status: "offline",
          fuelPercent: null,
          fuelQuantity: null,
          connectedAssemblyIds: [],
        },
      ],
    },
  ],
} as const;

const lookups = {
  tribeNames: new Map([[3, "Caldari"]]),
  typeNames: new Map([
    [77917, "Heavy Storage"],
    [88064, "Heavy Refinery"],
    [88092, "Network Node"],
  ]),
};

describe("eve ownership domain helpers", () => {
  it("maps discovered structures into character summaries", async () => {
    const modulePath = "./eveOwnershipMappers";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      mapDiscoveryToCharacterSummaries: undefined,
    }));

    expect(typeof loadedModule.mapDiscoveryToCharacterSummaries).toBe("function");

    const summaries = loadedModule.mapDiscoveryToCharacterSummaries?.(
      discovery,
      access,
      lookups,
    );

    expect(summaries).toEqual([
      {
        id: "0xchar-1",
        name: "Rhea Ancru",
        tribeName: "Caldari",
        walletAddress: "0xwallet-1",
        walletSource: "sui-address",
        walletSourceLabel: "SUI address",
        networkNodeCount: 1,
        currentShipName: null,
      },
    ]);
  });

  it("maps network nodes with connected assemblies from discovered structures", async () => {
    const modulePath = "./eveOwnershipMappers";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      mapDiscoveryToNetworkNodes: undefined,
    }));

    expect(typeof loadedModule.mapDiscoveryToNetworkNodes).toBe("function");

    const nodes = loadedModule.mapDiscoveryToNetworkNodes?.(
      discovery,
      "0xchar-1",
      lookups,
    );

    expect(nodes).toEqual([
      {
        id: "0xnode-1",
        name: "Power Spine",
        systemName: null,
        connectedAssemblyCount: 1,
        status: "online",
        fuelPercent: 60,
        fuelQuantity: 6,
        connectedAssemblies: [
          {
            id: "0xstorage-1",
            name: "Vault Alpha",
            typeLabel: "Heavy Storage",
            status: "online",
          },
        ],
      },
    ]);
  });

  it("groups a character's assemblies by resolved type name", async () => {
    const modulePath = "./eveOwnershipMappers";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      mapDiscoveryToAssembliesByType: undefined,
    }));

    expect(typeof loadedModule.mapDiscoveryToAssembliesByType).toBe("function");

    const groups = loadedModule.mapDiscoveryToAssembliesByType?.(
      discovery,
      "0xchar-1",
      lookups,
    );

    expect(groups).toEqual({
      "Heavy Refinery": [
        {
          id: "0xrefinery-1",
          name: "Refinery One",
          typeLabel: "Heavy Refinery",
          status: "offline",
          typeId: 88064,
          typeRepr: "0xpkg::assembly::Assembly",
        },
      ],
      "Heavy Storage": [
        {
          id: "0xstorage-1",
          name: "Vault Alpha",
          typeLabel: "Heavy Storage",
          status: "online",
          typeId: 77917,
          typeRepr: "0xpkg::storage_unit::StorageUnit",
        },
      ],
    });
  });
});

describe("address helpers", () => {
  it("normalizes and shortens sui addresses", async () => {
    const modulePath = "../address";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      formatShortAddress: undefined,
      normalizeSuiAddress: undefined,
    }));

    expect(typeof loadedModule.normalizeSuiAddress).toBe("function");
    expect(typeof loadedModule.formatShortAddress).toBe("function");

    expect(loadedModule.normalizeSuiAddress?.(" 0xAbCdEf1234 ")).toBe("0xabcdef1234");
    expect(loadedModule.normalizeSuiAddress?.("not-an-address")).toBeNull();
    expect(loadedModule.formatShortAddress?.("0xabcdef1234567890")).toBe("0xabcd…7890");
  });
});

describe("external links", () => {
  it("builds suiscan links for accounts and objects", async () => {
    const modulePath = "../suiscan";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      getSuiscanAddressUrl: undefined,
      getSuiscanObjectUrl: undefined,
    }));

    expect(typeof loadedModule.getSuiscanAddressUrl).toBe("function");
    expect(typeof loadedModule.getSuiscanObjectUrl).toBe("function");

    expect(loadedModule.getSuiscanAddressUrl?.("0xwallet-1")).toBe(
      "https://suiscan.xyz/testnet/account/0xwallet-1",
    );
    expect(loadedModule.getSuiscanObjectUrl?.("0xobject-1")).toBe(
      "https://suiscan.xyz/testnet/object/0xobject-1",
    );
  });

  it("returns wiki links for known assembly types", async () => {
    const modulePath = "../wikiLinks";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      getAssemblyWikiUrl: undefined,
    }));

    expect(typeof loadedModule.getAssemblyWikiUrl).toBe("function");

    expect(loadedModule.getAssemblyWikiUrl?.("Heavy Storage")).toBe(
      "https://evefrontier.wiki/Heavy_Storage",
    );
    expect(loadedModule.getAssemblyWikiUrl?.("Unknown Assembly")).toBeNull();
  });
});
