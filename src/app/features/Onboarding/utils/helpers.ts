/* ─── Onboarding Utility Helpers ─── */

/**
 * Safe property access that prevents prototype pollution.
 */
export function safeGet<T>(obj: unknown, key: string | number): T | undefined {
  if (
    !obj ||
    typeof obj !== "object" ||
    key === "__proto__" ||
    key === "constructor" ||
    key === "prototype"
  ) {
    return undefined;
  }
  const desc = Object.getOwnPropertyDescriptor(obj, key);
  return desc ? (desc.value as T) : undefined;
}

/**
 * Safe property setter that prevents prototype pollution.
 */
export function safeSet(
  obj: Record<string | number, unknown>,
  key: string | number,
  value: unknown,
): Record<string | number, unknown> {
  const updated = { ...obj };
  if (key !== "__proto__" && key !== "constructor" && key !== "prototype") {
    Object.defineProperty(updated, key, {
      value,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
  return updated;
}

/**
 * Format a date string to "Mon DD, YYYY".
 */
export const formatDate = (d: string) => {
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Get initials from a full name (max 2 chars).
 */
export const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
