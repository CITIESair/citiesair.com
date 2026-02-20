export const LocalStorage = {
  theme: 'theme',
  temperatureUnit: 'temperatureUnit',
  schoolId: 'schoolId',
  hiddenPromos: 'hiddenPromos',
} as const;

export type LocalStorageKey = typeof LocalStorage[keyof typeof LocalStorage];

/**
 * Safely reads a localStorage value and validates it against a set of valid
 * enum values at runtime. Falls back to the provided default if the stored
 * value is missing, stale, or no longer part of the current type.
 */
export function parseLocalStorageEnum<T extends string>(
  key: LocalStorageKey,
  validValues: readonly T[],
  fallback: T
): T {
  const stored = localStorage.getItem(key);
  if (stored !== null && (validValues as readonly string[]).includes(stored)) {
    return stored as T;
  }
  return fallback;
}

/**
 * Safely reads and parses a localStorage value expected to be a JSON string[]
 * array. Falls back to [] if the value is missing, not valid JSON, or not an
 * array of strings (e.g. the stored shape changed after a type refactor).
 */
export function parseLocalStorageStringArray(key: LocalStorageKey): string[] {
  const stored = localStorage.getItem(key);
  if (stored === null) return [];
  try {
    const parsed: unknown = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
      return parsed as string[];
    }
  } catch {
    // stored value is not valid JSON — fall through to default
  }
  return [];
}
