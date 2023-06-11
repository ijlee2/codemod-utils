import type { Entries, JsonObject } from '../types/index.js';

export function convertToMap(object: JsonObject = {}) {
  const entries = Object.entries(object) as Entries<typeof object>;

  return new Map(entries);
}
