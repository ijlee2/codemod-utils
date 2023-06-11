import type { Entries, JsonObject } from 'type-fest';

export function convertToMap(object: JsonObject = {}) {
  const entries = Object.entries(object) as Entries<typeof object>;

  return new Map(entries);
}
