export function convertToObject(map = new Map()) {
  const sortedMap = new Map([...map.entries()].sort());

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Object.fromEntries(sortedMap);
}
