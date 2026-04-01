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
          fuelEtaMs: 3_240_000,
          fuelTypeId: 78437,
          fuelQuantity: 6,
          location: {
            solarSystemId: 30013131,
            x: "-100",
            y: "25",
            z: "3000",
          },
          connectedAssemblyIds: ["0xstorage-1"],
        },
        {
          id: "0xstorage-1",
          typeId: 77917,
          typeLabel: "Storage Unit",
          typeRepr: "0xpkg::storage_unit::StorageUnit",
          name: "Vault Alpha",
          description: "Keep the isotopes moving.",
          url: "https://example.com/vault-alpha",
          itemId: 1000000011001,
          tenant: "utopia",
          ownerCapId: "0xowner-cap-1",
          energySourceId: "0xnode-1",
          status: "online",
          fuelPercent: null,
          fuelQuantity: null,
          location: {
            solarSystemId: 30013131,
            x: "-200",
            y: "50",
            z: "6000",
          },
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
        {
          id: "0xgate-1",
          typeId: 84955,
          typeLabel: "Gate",
          typeRepr: "0xpkg::gate::Gate",
          name: "Transit Authority",
          description: "Permit-managed border gate.",
          url: "https://example.com/transit-authority",
          itemId: 1000000012001,
          tenant: "utopia",
          ownerCapId: "0xowner-cap-1",
          status: "online",
          fuelPercent: null,
          fuelQuantity: null,
          energySourceId: "0xnode-1",
          linkedGateId: "0xgate-2",
          extensionType: "0xextension::gate_rules::GateAuth",
          connectedAssemblyIds: [],
        },
        {
          id: "0xgate-2",
          typeId: 84955,
          typeLabel: "Gate",
          typeRepr: "0xpkg::gate::Gate",
          name: "Far Horizon",
          ownerCapId: "0xowner-cap-1",
          status: "offline",
          fuelPercent: null,
          fuelQuantity: null,
          connectedAssemblyIds: [],
        },
        {
          id: "0xturret-1",
          typeId: 84556,
          typeLabel: "Turret",
          typeRepr: "0xpkg::turret::Turret",
          name: "Sentinel Grid",
          description: "Aggressor-first defensive turret.",
          url: "https://example.com/sentinel-grid",
          itemId: 1000000013001,
          tenant: "utopia",
          ownerCapId: "0xowner-cap-1",
          status: "online",
          fuelPercent: null,
          fuelQuantity: null,
          energySourceId: "0xnode-1",
          extensionType: "0xextension::turret_rules::TurretAuth",
          connectedAssemblyIds: [],
        },
      ],
    },
  ],
} as const;

const lookups = {
  tribeNames: new Map([[3, "Caldari"]]),
  typeNames: new Map([
    [78437, "EU-90 Fuel"],
    [77917, "Heavy Storage"],
    [84556, "Smart Turret"],
    [87161, "Field Refinery"],
    [88064, "Heavy Refinery"],
    [88092, "Network Node"],
  ]),
  typeIcons: new Map([
    [78437, "https://cdn.example/types/78437.png"],
    [77917, "https://cdn.example/types/77917.png"],
    [84556, "https://cdn.example/types/84556.png"],
    [84955, "https://cdn.example/types/84955.png"],
    [88064, "https://cdn.example/types/88064.png"],
    [88092, "https://cdn.example/types/88092.png"],
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
        ownedStructureCount: 6,
        defaultDashboardSection: "network-nodes",
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
        systemName: "ABJ-G43",
        iconUrl: "https://cdn.example/types/88092.png",
        connectedAssemblyCount: 1,
        status: "online",
        fuelPercent: 60,
        fuelEtaMs: 3_240_000,
        fuelTypeId: 78437,
        fuelTypeName: "EU-90 Fuel",
        fuelTypeIconUrl: "https://cdn.example/types/78437.png",
        fuelQuantity: 6,
        location: {
          solarSystemId: 30013131,
          x: "-100",
          y: "25",
          z: "3000",
        },
        connectedAssemblies: [
          {
            id: "0xstorage-1",
            name: "Vault Alpha",
            typeLabel: "Heavy Storage",
            iconUrl: "https://cdn.example/types/77917.png",
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
      Gate: [
        {
          id: "0xgate-2",
          name: "Far Horizon",
          systemName: null,
          iconUrl: "https://cdn.example/types/84955.png",
          typeLabel: "Gate",
          status: "offline",
          typeId: 84955,
          typeRepr: "0xpkg::gate::Gate",
        },
        {
          id: "0xgate-1",
          name: "Transit Authority",
          systemName: null,
          iconUrl: "https://cdn.example/types/84955.png",
          typeLabel: "Gate",
          status: "online",
          typeId: 84955,
          typeRepr: "0xpkg::gate::Gate",
        },
      ],
      "Heavy Refinery": [
        {
          id: "0xrefinery-1",
          name: "Refinery One",
          systemName: null,
          iconUrl: "https://cdn.example/types/88064.png",
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
          systemName: "ABJ-G43",
          iconUrl: "https://cdn.example/types/77917.png",
          location: {
            solarSystemId: 30013131,
            x: "-200",
            y: "50",
            z: "6000",
          },
          typeLabel: "Heavy Storage",
          status: "online",
          typeId: 77917,
          typeRepr: "0xpkg::storage_unit::StorageUnit",
        },
      ],
      "Smart Turret": [
        {
          id: "0xturret-1",
          name: "Sentinel Grid",
          systemName: null,
          iconUrl: "https://cdn.example/types/84556.png",
          typeLabel: "Smart Turret",
          status: "online",
          typeId: 84556,
          typeRepr: "0xpkg::turret::Turret",
        },
      ],
    });
  });

  it("formats fallback assembly names with the resolved type label and short object id", async () => {
    const fallbackDiscovery = {
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
              id: "0xabcdef1234567890",
              typeId: 77917,
              typeLabel: "Storage Unit",
              typeRepr: "0xpkg::storage_unit::StorageUnit",
              name: "Storage Unit 0xabcd…7890",
              ownerCapId: "0xowner-cap-1",
              status: "online",
              fuelPercent: null,
              fuelQuantity: null,
              connectedAssemblyIds: [],
            },
          ],
        },
      ],
    } as const;

    const modulePath = "./eveOwnershipMappers";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      mapDiscoveryToAssembliesByType: undefined,
    }));

    expect(typeof loadedModule.mapDiscoveryToAssembliesByType).toBe("function");

    const groups = loadedModule.mapDiscoveryToAssembliesByType?.(
      fallbackDiscovery,
      "0xchar-1",
      lookups,
    );

    expect(groups).toEqual({
      "Heavy Storage": [
        {
          id: "0xabcdef1234567890",
          name: "Heavy Storage · 0xabcd…7890",
          iconUrl: "https://cdn.example/types/77917.png",
          systemName: null,
          typeLabel: "Heavy Storage",
          status: "online",
          typeId: 77917,
          typeRepr: "0xpkg::storage_unit::StorageUnit",
        },
      ],
    });
  });

  it("maps one network node into a detail summary with grouped connected assemblies", async () => {
    const detailDiscovery = {
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
              id: "0x0123456789abcdef",
              typeId: 88092,
              typeLabel: "Network Node",
              typeRepr: "0xpkg::network_node::NetworkNode",
              name: "Power Spine",
              ownerCapId: "0xowner-cap-1",
              status: "online",
              fuelPercent: 60,
              fuelTypeId: 78437,
              fuelQuantity: 6,
              connectedAssemblyIds: [
                "0xgate-1",
                "0xstorage-1",
                "0xturret-1",
                "0xother-1",
              ],
            },
            {
              id: "0xgate-1",
              typeId: 88001,
              typeLabel: "Gate",
              typeRepr: "0xpkg::gate::Gate",
              name: "Argent Gate",
              ownerCapId: "0xowner-cap-1",
              status: "online",
              fuelPercent: null,
              fuelQuantity: null,
              connectedAssemblyIds: [],
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
              id: "0xturret-1",
              typeId: 84556,
              typeLabel: "Assembly",
              typeRepr: "0xpkg::assembly::Assembly",
              name: "Assembly 0xturret-1",
              ownerCapId: "0xowner-cap-1",
              status: "offline",
              fuelPercent: null,
              fuelQuantity: null,
              connectedAssemblyIds: [],
            },
            {
              id: "0xother-1",
              typeId: 87161,
              typeLabel: "Assembly",
              typeRepr: "0xpkg::assembly::Assembly",
              name: "Assembly 0xother-1",
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

    const modulePath = "./eveOwnershipMappers";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      mapDiscoveryToNetworkNodeDetail: undefined,
    }));

    expect(typeof loadedModule.mapDiscoveryToNetworkNodeDetail).toBe("function");

    const detail = loadedModule.mapDiscoveryToNetworkNodeDetail?.(
      detailDiscovery,
      "0xchar-1",
      "0x0123456789abcdef",
      lookups,
    );

    expect(detail).toEqual({
      id: "0x0123456789abcdef",
      name: "Power Spine",
      systemName: null,
      connectedAssemblyCount: 4,
      status: "online",
      fuelPercent: 60,
      fuelEtaMs: undefined,
      fuelTypeId: 78437,
      fuelTypeName: "EU-90 Fuel",
      fuelTypeIconUrl: "https://cdn.example/types/78437.png",
      fuelQuantity: 6,
      iconUrl: "https://cdn.example/types/88092.png",
      connectedAssemblies: [
        {
          id: "0xgate-1",
          name: "Argent Gate",
          typeLabel: "Gate",
          iconUrl: null,
          status: "online",
        },
        {
          id: "0xstorage-1",
          name: "Vault Alpha",
          typeLabel: "Heavy Storage",
          iconUrl: "https://cdn.example/types/77917.png",
          status: "online",
        },
        {
          id: "0xturret-1",
          name: "Assembly 0xturret-1",
          typeLabel: "Smart Turret",
          iconUrl: "https://cdn.example/types/84556.png",
          status: "offline",
        },
        {
          id: "0xother-1",
          name: "Assembly 0xother-1",
          typeLabel: "Field Refinery",
          iconUrl: null,
          status: "offline",
        },
      ],
      connectedAssemblyGroups: [
        {
          label: "Gate",
          assemblies: [
            {
              id: "0xgate-1",
              name: "Argent Gate",
              typeLabel: "Gate",
              iconUrl: null,
              status: "online",
            },
          ],
        },
        {
          label: "Storage",
          assemblies: [
            {
              id: "0xstorage-1",
              name: "Vault Alpha",
              typeLabel: "Heavy Storage",
              iconUrl: "https://cdn.example/types/77917.png",
              status: "online",
            },
          ],
        },
        {
          label: "Turret",
          assemblies: [
            {
              id: "0xturret-1",
              name: "Assembly 0xturret-1",
              typeLabel: "Smart Turret",
              iconUrl: "https://cdn.example/types/84556.png",
              status: "offline",
            },
          ],
        },
        {
          label: "Other",
          assemblies: [
            {
              id: "0xother-1",
              name: "Assembly 0xother-1",
              typeLabel: "Field Refinery",
              iconUrl: null,
              status: "offline",
            },
          ],
        },
      ],
    });
  });

  it("classifies related gate assemblies from character discovery fallback data", async () => {
    const relatedGateDiscovery = {
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
              connectedAssemblyIds: ["0xforeign-gate-1"],
            },
          ],
          relatedStructures: [
            {
              id: "0xforeign-gate-1",
              typeId: 84955,
              typeLabel: "Gate",
              typeRepr: "0xpkg::gate::Gate",
              name: "Frontier Transit Authority",
              ownerCapId: "0xforeign-cap",
              status: "offline",
              fuelPercent: null,
              fuelQuantity: null,
              connectedAssemblyIds: [],
            },
          ],
        },
      ],
    } as const;

    const modulePath = "./eveOwnershipMappers";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      mapDiscoveryToNetworkNodeDetail: undefined,
      mapDiscoveryToAssembliesByType: undefined,
    }));

    expect(typeof loadedModule.mapDiscoveryToNetworkNodeDetail).toBe("function");
    expect(typeof loadedModule.mapDiscoveryToAssembliesByType).toBe("function");

    const detail = loadedModule.mapDiscoveryToNetworkNodeDetail?.(
      relatedGateDiscovery,
      "0xchar-1",
      "0xnode-1",
      lookups,
    );
    const groups = loadedModule.mapDiscoveryToAssembliesByType?.(
      relatedGateDiscovery,
      "0xchar-1",
      lookups,
    );

    expect(detail?.connectedAssemblyGroups[0]).toEqual({
      label: "Gate",
      assemblies: [
        {
          id: "0xforeign-gate-1",
          name: "Frontier Transit Authority",
          typeLabel: "Gate",
          iconUrl: "https://cdn.example/types/84955.png",
          status: "offline",
        },
      ],
    });
    expect(groups).toEqual({
      Gate: [
        {
          id: "0xforeign-gate-1",
          name: "Frontier Transit Authority",
          systemName: null,
          iconUrl: "https://cdn.example/types/84955.png",
          typeLabel: "Gate",
          status: "offline",
          typeId: 84955,
          typeRepr: "0xpkg::gate::Gate",
        },
      ],
    });
  });

  it("maps a gate detail summary with resolved linked gate and energy source metadata", async () => {
    const modulePath = "./eveOwnershipMappers";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      mapDiscoveryToAssemblyDetail: undefined,
    }));

    expect(typeof loadedModule.mapDiscoveryToAssemblyDetail).toBe("function");

    const detail = loadedModule.mapDiscoveryToAssemblyDetail?.(
      discovery,
      "0xchar-1",
      "0xgate-1",
      lookups,
    );

    expect(detail).toEqual({
      id: "0xgate-1",
      name: "Transit Authority",
      systemName: null,
      typeId: 84955,
      typeLabel: "Gate",
      typeRepr: "0xpkg::gate::Gate",
      iconUrl: "https://cdn.example/types/84955.png",
      status: "online",
      description: "Permit-managed border gate.",
      url: "https://example.com/transit-authority",
      itemId: 1000000012001,
      tenant: "utopia",
      ownerCapId: "0xowner-cap-1",
      energySourceId: "0xnode-1",
      energySourceName: "Power Spine",
      linkedGateId: "0xgate-2",
      linkedGateName: "Far Horizon",
      extensionType: "0xextension::gate_rules::GateAuth",
      extensionLabel: "Custom extension",
      extensionFrozen: null,
      gateAccessMode: "Permit required",
    });
  });

  it("maps a turret detail summary with resolved energy source and extension label", async () => {
    const modulePath = "./eveOwnershipMappers";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      mapDiscoveryToAssemblyDetail: undefined,
    }));

    expect(typeof loadedModule.mapDiscoveryToAssemblyDetail).toBe("function");

    const detail = loadedModule.mapDiscoveryToAssemblyDetail?.(
      discovery,
      "0xchar-1",
      "0xturret-1",
      lookups,
    );

    expect(detail).toEqual({
      id: "0xturret-1",
      name: "Sentinel Grid",
      systemName: null,
      typeId: 84556,
      typeLabel: "Smart Turret",
      typeRepr: "0xpkg::turret::Turret",
      iconUrl: "https://cdn.example/types/84556.png",
      status: "online",
      description: "Aggressor-first defensive turret.",
      url: "https://example.com/sentinel-grid",
      itemId: 1000000013001,
      tenant: "utopia",
      ownerCapId: "0xowner-cap-1",
      energySourceId: "0xnode-1",
      energySourceName: "Power Spine",
      linkedGateId: null,
      linkedGateName: null,
      extensionType: "0xextension::turret_rules::TurretAuth",
      extensionLabel: "Custom extension",
      extensionFrozen: null,
      gateAccessMode: null,
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
