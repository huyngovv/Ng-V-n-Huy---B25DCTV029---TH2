const KEY = "favorites";

export function loadFavs(): Set<string> {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return new Set(Array.isArray(stored) ? stored.filter((id): id is string => typeof id === "string") : []);
  } catch {
    return new Set();
  }
}

export function saveFavs(set: Set<string>): void {
  localStorage.setItem(KEY, JSON.stringify([...set]));
}
