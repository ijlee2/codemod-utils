import { globSync } from 'glob';

export function findFiles(pattern, { cwd, ignoreList = [] }) {
  if (!pattern) {
    throw new RangeError('ERROR: The glob pattern is undefined.\n');
  }

  if (!cwd) {
    throw new RangeError(
      'ERROR: The current working directory is undefined.\n',
    );
  }

  const filePaths = globSync(pattern, {
    cwd,
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
