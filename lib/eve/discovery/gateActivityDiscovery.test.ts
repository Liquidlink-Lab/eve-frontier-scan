import { describe, expect, it, vi } from "vitest";

describe("gateActivityDiscovery", () => {
  it("scans recent jump and permit events for the requested gate", async () => {
    const rpc = vi
      .fn()
      .mockResolvedValueOnce({
        result: {
          data: [
            {
              id: {
                txDigest: "tx-jump-1",
                eventSeq: "0",
              },
              parsedJson: {
                source_gate_id: "0xgate-1",
                source_gate_key: {
                  item_id: "1001",
                  tenant: "utopia",
                },
                destination_gate_id: "0xgate-2",
                destination_gate_key: {
                  item_id: "1002",
                  tenant: "utopia",
                },
                character_id: "0xpilot-1",
                character_key: {
                  item_id: "2112000137",
                  tenant: "utopia",
                },
              },
              timestampMs: "1710000000000",
            },
            {
              id: {
                txDigest: "tx-jump-ignored",
                eventSeq: "1",
              },
              parsedJson: {
                source_gate_id: "0xother-1",
                destination_gate_id: "0xother-2",
                character_id: "0xpilot-2",
              },
              timestampMs: "1710000000500",
            },
          ],
          hasNextPage: true,
          nextCursor: {
            txDigest: "tx-jump-ignored",
            eventSeq: "1",
          },
        },
      })
      .mockResolvedValueOnce({
        result: {
          data: [
            {
              id: {
                txDigest: "tx-jump-2",
                eventSeq: "0",
              },
              parsedJson: {
                source_gate_id: "0xgate-3",
                source_gate_key: {
                  item_id: "1003",
                  tenant: "utopia",
                },
                destination_gate_id: "0xgate-1",
                destination_gate_key: {
                  item_id: "1001",
                  tenant: "utopia",
                },
                character_id: "0xpilot-3",
                character_key: {
                  item_id: "2112000999",
                  tenant: "utopia",
                },
              },
              timestampMs: "1710000001000",
            },
          ],
          hasNextPage: false,
          nextCursor: null,
        },
      })
      .mockResolvedValueOnce({
        result: {
          data: [
            {
              id: {
                txDigest: "tx-permit-1",
                eventSeq: "0",
              },
              parsedJson: {
                jump_permit_id: "0xpermit-1",
                source_gate_id: "0xgate-1",
                source_gate_key: {
                  item_id: "1001",
                  tenant: "utopia",
                },
                destination_gate_id: "0xgate-2",
                destination_gate_key: {
                  item_id: "1002",
                  tenant: "utopia",
                },
                character_id: "0xpilot-1",
                character_key: {
                  item_id: "2112000137",
                  tenant: "utopia",
                },
                expires_at_timestamp_ms: "1710003600000",
                extension_type: {
                  name: "0xextension::gate_rules::GateAuth",
                },
              },
              timestampMs: "1710000002000",
            },
          ],
          hasNextPage: false,
          nextCursor: null,
        },
      });

    const modulePath = "./gateActivityDiscovery";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      discoverGateActivity: undefined,
    }));

    expect(typeof loadedModule.discoverGateActivity).toBe("function");

    const result = await loadedModule.discoverGateActivity?.({
      gateId: "0xgate-1",
      packageId: "0xpkg",
      rpc,
      maxPages: 2,
      pageSize: 2,
    });

    expect(rpc).toHaveBeenNthCalledWith(1, "suix_queryEvents", [
      {
        MoveEventType: "0xpkg::gate::JumpEvent",
      },
      null,
      2,
      true,
    ]);
    expect(rpc).toHaveBeenNthCalledWith(2, "suix_queryEvents", [
      {
        MoveEventType: "0xpkg::gate::JumpEvent",
      },
      {
        txDigest: "tx-jump-ignored",
        eventSeq: "1",
      },
      2,
      true,
    ]);
    expect(rpc).toHaveBeenNthCalledWith(3, "suix_queryEvents", [
      {
        MoveEventType: "0xpkg::gate::JumpPermitIssuedEvent",
      },
      null,
      2,
      true,
    ]);
    expect(result).toEqual({
      recentJumps: [
        {
          txDigest: "tx-jump-1",
          timestampMs: 1710000000000,
          sourceGateId: "0xgate-1",
          sourceGateItemId: 1001,
          destinationGateId: "0xgate-2",
          destinationGateItemId: 1002,
          characterId: "0xpilot-1",
          characterItemId: 2112000137,
        },
        {
          txDigest: "tx-jump-2",
          timestampMs: 1710000001000,
          sourceGateId: "0xgate-3",
          sourceGateItemId: 1003,
          destinationGateId: "0xgate-1",
          destinationGateItemId: 1001,
          characterId: "0xpilot-3",
          characterItemId: 2112000999,
        },
      ],
      recentPermits: [
        {
          txDigest: "tx-permit-1",
          jumpPermitId: "0xpermit-1",
          sourceGateId: "0xgate-1",
          sourceGateItemId: 1001,
          destinationGateId: "0xgate-2",
          destinationGateItemId: 1002,
          characterId: "0xpilot-1",
          characterItemId: 2112000137,
          expiresAtMs: 1710003600000,
          extensionType: "0xextension::gate_rules::GateAuth",
          timestampMs: 1710000002000,
        },
      ],
    });
  });

  it("returns empty activity lists when no recent gate events exist", async () => {
    const rpc = vi.fn().mockResolvedValue({
      result: {
        data: [],
        hasNextPage: false,
        nextCursor: null,
      },
    });

    const modulePath = "./gateActivityDiscovery";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      discoverGateActivity: undefined,
    }));

    expect(typeof loadedModule.discoverGateActivity).toBe("function");

    const result = await loadedModule.discoverGateActivity?.({
      gateId: "0xgate-1",
      packageId: "0xpkg",
      rpc,
      maxPages: 1,
      pageSize: 10,
    });

    expect(result).toEqual({
      recentJumps: [],
      recentPermits: [],
    });
  });
});
