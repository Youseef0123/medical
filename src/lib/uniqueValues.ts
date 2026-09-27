/** Unique, non-empty values of a field (case-insensitive), in first-seen order. */
export function uniqueValues<T>(items: T[], pick: (item: T) => string | undefined): string[] {
  const seen = new Map<string, string>();
  for (const item of items) {
    const value = pick(item)?.trim();
    if (value && !seen.has(value.toLowerCase())) seen.set(value.toLowerCase(), value);
  }
  return [...seen.values()];
}
