export function unionize(files: string[]): string {
  if (files.length <= 1) {
    return files.join(',');
  }

  return `{${files.join(',')}}`;
}
