export function convertToMap(object = {}) {
  const entries = Object.entries(object);

  return new Map(entries);
}
