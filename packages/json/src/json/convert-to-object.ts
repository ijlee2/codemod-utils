import type { JsonObject } from 'type-fest';

import type { convertToMap } from './convert-to-map.js';

type JsonMap = ReturnType<typeof convertToMap>;

export function convertToObject(map: JsonMap = new Map()) {
  const sortedMap = new Map([...map.entries()].sort());

  return Object.fromEntries(sortedMap) as JsonObject;
}
