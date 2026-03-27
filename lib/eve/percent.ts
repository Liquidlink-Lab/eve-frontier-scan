function trimTrailingZeros(value: string) {
  return value.replace(/\.?0+$/, "");
}

export function clampPercentage(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

export function calculatePercentage(
  numerator: number | null,
  denominator: number | null,
) {
  if (
    numerator === null ||
    denominator === null ||
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    denominator <= 0 ||
    numerator < 0
  ) {
    return null;
  }

  return clampPercentage((numerator / denominator) * 100);
}

export function formatPercentage(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "Unavailable";
  }

  const normalizedValue = clampPercentage(value);

  if (normalizedValue === 0 || normalizedValue === 100) {
    return `${normalizedValue}%`;
  }

  if (normalizedValue < 1) {
    return `${trimTrailingZeros(normalizedValue.toFixed(3))}%`;
  }

  if (normalizedValue < 10) {
    return `${trimTrailingZeros(normalizedValue.toFixed(1))}%`;
  }

  return `${Math.round(normalizedValue)}%`;
}
