import { describe, expect, it, vi } from "vitest";

describe("turretActivityDiscovery", () => {
  it("returns the latest target priority snapshot for a turret", async () => {
    const rpc = vi
      .fn()
      .mockResolvedValueOnce({
        result: {
          data: [
            {
              id: {
                txDigest: "tx-unrelated",
                eventSeq: "0",
              },
              parsedJson: {
                turret_id: "0xother-turret",
                priority_list: [],
              },
              timestampMs: "1710000000500",
            },
          ],
          hasNextPage: true,
          nextCursor: {
            txDigest: "tx-unrelated",
            eventSeq: "0",
          },
        },
      })
      .mockResolvedValueOnce({
        result: {
          data: [
            {
              id: {
                txDigest: "tx-turret-1",
                eventSeq: "0",
              },
              parsedJson: {
                turret_id: "0xturret-1",
                priority_list: [
                  {
                    item_id: "501",
                    type_id: "84556",
                    group_id: "12",
                    character_id: "31",
                    character_tribe: "4",
                    hp_ratio: "80",
                    shield_ratio: "55",
                    armor_ratio: "92",
                    is_aggressor: true,
                    priority_weight: "11000",
                    behaviour_change: "STARTED_ATTACK",
                  },
                  {
                    item_id: "777",
                    type_id: "84901",
                    group_id: "14",
                    character_id: "0",
                    character_tribe: "0",
                    hp_ratio: "100",
                    shield_ratio: "100",
                    armor_ratio: "100",
                    is_aggressor: false,
                    priority_weight: "1000",
                    behaviour_change: "ENTERED",
                  },
                ],
              },
              timestampMs: "1710000000000",
            },
          ],
          hasNextPage: false,
          nextCursor: null,
        },
      });

    const modulePath = "./turretActivityDiscovery";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      discoverTurretActivity: undefined,
    }));

    expect(typeof loadedModule.discoverTurretActivity).toBe("function");

    const result = await loadedModule.discoverTurretActivity?.({
      turretId: "0xturret-1",
      packageId: "0xpkg",
      rpc,
      maxPages: 2,
      pageSize: 1,
    });

    expect(rpc).toHaveBeenNthCalledWith(1, "suix_queryEvents", [
      {
        MoveEventType: "0xpkg::turret::PriorityListUpdatedEvent",
      },
      null,
      1,
      true,
    ]);
    expect(rpc).toHaveBeenNthCalledWith(2, "suix_queryEvents", [
      {
        MoveEventType: "0xpkg::turret::PriorityListUpdatedEvent",
      },
      {
        txDigest: "tx-unrelated",
        eventSeq: "0",
      },
      1,
      true,
    ]);
    expect(result).toEqual({
      txDigest: "tx-turret-1",
      updatedAtMs: 1710000000000,
      targets: [
        {
          itemId: 501,
          typeId: 84556,
          groupId: 12,
          characterId: 31,
          characterTribe: 4,
          hpRatio: 80,
          shieldRatio: 55,
          armorRatio: 92,
          isAggressor: true,
          priorityWeight: 11000,
          behaviourChange: "STARTED_ATTACK",
        },
        {
          itemId: 777,
          typeId: 84901,
          groupId: 14,
          characterId: 0,
          characterTribe: 0,
          hpRatio: 100,
          shieldRatio: 100,
          armorRatio: 100,
          isAggressor: false,
          priorityWeight: 1000,
          behaviourChange: "ENTERED",
        },
      ],
    });
  });

  it("returns null when no turret priority snapshots exist", async () => {
    const rpc = vi.fn().mockResolvedValue({
      result: {
        data: [],
        hasNextPage: false,
        nextCursor: null,
      },
    });

    const modulePath = "./turretActivityDiscovery";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      discoverTurretActivity: undefined,
    }));

    expect(typeof loadedModule.discoverTurretActivity).toBe("function");

    const result = await loadedModule.discoverTurretActivity?.({
      turretId: "0xturret-1",
      packageId: "0xpkg",
      rpc,
      maxPages: 1,
      pageSize: 20,
    });

    expect(result).toBeNull();
  });
});
