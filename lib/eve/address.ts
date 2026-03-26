export function normalizeSuiAddress(value: string) {
  const trimmedValue = value.trim();

  if (!/^0x[a-fA-F0-9]+$/.test(trimmedValue)) {
    return null;
  }

  return trimmedValue.toLowerCase();
}

export function formatShortAddress(value: string) {
  if (value.length <= 10) {
    return value;
  }

  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}
