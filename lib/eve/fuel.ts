const DEFAULT_FUEL_EFFICIENCIES = new Map<number, number>([
  [78437, 90],
  [78515, 80],
  [78516, 40],
  [84868, 40],
  [88319, 15],
  [88335, 10],
]);

interface FuelFillPercentInput {
  maxCapacity: number | null;
  quantity: number | null;
  unitVolume: number | null;
}

interface FuelEtaInput {
  burnRateInMs: number | null;
  burnStartTime: number | null;
  fuelTypeId: number | null;
  isBurning: boolean;
  previousCycleElapsedTime: number | null;
  quantity: number | null;
}

export function calculateFuelFillPercent({
  maxCapacity,
  quantity,
  unitVolume,
}: FuelFillPercentInput) {
  if (
    maxCapacity === null ||
    quantity === null ||
    unitVolume === null ||
    maxCapacity <= 0 ||
    unitVolume <= 0 ||
    quantity < 0
  ) {
    return null;
  }

  return Math.round(((quantity * unitVolume) / maxCapacity) * 100);
}

export function calculateFuelEtaMs(
  {
    burnRateInMs,
    burnStartTime,
    fuelTypeId,
    isBurning,
    previousCycleElapsedTime,
    quantity,
  }: FuelEtaInput,
  nowMs = Date.now(),
) {
  if (
    !isBurning ||
    burnRateInMs === null ||
    burnStartTime === null ||
    fuelTypeId === null ||
    quantity === null
  ) {
    return null;
  }

  const fuelEfficiency = DEFAULT_FUEL_EFFICIENCIES.get(fuelTypeId);

  if (!fuelEfficiency || burnRateInMs <= 0 || quantity < 0) {
    return null;
  }

  const actualConsumptionRateMs = Math.floor((burnRateInMs * fuelEfficiency) / 100);

  if (actualConsumptionRateMs <= 0) {
    return null;
  }

  const elapsedMs = Math.max(nowMs - burnStartTime, 0);
  const totalElapsedMs = elapsedMs + Math.max(previousCycleElapsedTime ?? 0, 0);
  const unitsToConsume = Math.floor(totalElapsedMs / actualConsumptionRateMs);
  const remainingElapsedMs = totalElapsedMs % actualConsumptionRateMs;
  const remainingCycleCount = quantity - unitsToConsume + 1;

  if (remainingCycleCount <= 0) {
    return 0;
  }

  return (remainingCycleCount * actualConsumptionRateMs) - remainingElapsedMs;
}

export function formatFuelEta(durationMs: number | null | undefined) {
  if (durationMs === null || durationMs === undefined) {
    return "Unavailable";
  }

  if (durationMs < 60_000) {
    return "<1m";
  }

  const totalMinutes = Math.floor(durationMs / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  }

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  return `${minutes}m`;
}
