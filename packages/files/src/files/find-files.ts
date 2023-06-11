import { globSync } from 'glob';

export function findFiles(pattern, options) {
  const { ignoreList = [], projectRoot } = options;

  if (!pattern) {
    throw new RangeError('ERROR: The glob pattern is undefined.\n');
  }

  if (!projectRoot) {
    throw new RangeError('ERROR: The project root is undefined.\n');
  }

  const filePaths = globSync(pattern, {
    cwd: projectRoot,
    dot: true,
    ignore: ignoreList,
    nodir: true,
  });

  return filePaths.sort();
}

export function unionize(files) {
  if (files.length <= 1) {
    return files.join(',');
  }

  return `{${files.join(',')}}`;
}
