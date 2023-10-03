/**
 * Returns the glob pattern that can search multiple files
 * ("file A or file B or ..."). The glob pattern is to be
 * passed to `findFiles()`.
 *
 * @param files
 *
 * An array of file paths.
 *
 * @return
 *
 * A glob pattern that can be passed to `findFiles()`.
 *
 * @example
 *
 * Look for multiple files:
 *
 * ```ts
 * const pattern = unionize([
 *   'package-lock.json',
 *   'pnpm-lock.yaml',
 *   'yarn.lock',
 * ]);
 *
 * const filePaths = findFiles(pattern, {
 *   projectRoot,
 * });
 * ```
 */
export function unionize(files: string[]): string {
  if (files.length <= 1) {
    return files.join(',');
  }

  return `{${files.join(',')}}`;
}
