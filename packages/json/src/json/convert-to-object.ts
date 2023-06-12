export function convertToObject(map = new Map()) {
  const sortedMap = new Map([...map.entries()].sort());

  return Object.fromEntries(sortedMap);
}
