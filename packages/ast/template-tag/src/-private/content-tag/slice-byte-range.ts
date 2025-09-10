const BufferMap = new Map<string, Buffer>();

function getBuffer(str: string): Buffer {
  let buffer = BufferMap.get(str);

  if (!buffer) {
    buffer = Buffer.from(str);
    BufferMap.set(str, buffer);
  }

  return buffer;
}

export function sliceByteRange(
  str: string,
  indexStart: number,
  indexEnd?: number,
): string {
  const buffer = getBuffer(str);

  return buffer.slice(indexStart, indexEnd).toString();
}
