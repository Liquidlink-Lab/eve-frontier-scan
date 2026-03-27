import { describe, expect, it } from "vitest";

import {
  calculateFuelEtaMs,
  calculateFuelFillPercent,
  formatFuelEta,
} from "./fuel";

describe("fuel helpers", () => {
  it("calculates fuel fill percent from quantity, unit volume, and max capacity", () => {
    expect(
      calculateFuelFillPercent({
        maxCapacity: 100,
        quantity: 2,
        unitVolume: 30,
      }),
    ).toBe(60);
  });

  it("calculates a live eta for burning fuel using the configured fuel efficiency", () => {
    expect(
      calculateFuelEtaMs(
        {
          burnRateInMs: 3_600_000,
          burnStartTime: 100_000,
          fuelTypeId: 78_437,
          isBurning: true,
          previousCycleElapsedTime: 0,
          quantity: 2,
        },
        100_000,
      ),
    ).toBe(9_720_000);
  });

  it("formats long runtimes with compact day and hour units", () => {
    expect(formatFuelEta(3_240_000_000)).toBe("37d 12h");
  });
});
