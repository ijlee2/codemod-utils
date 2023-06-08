import { renameDirectory } from './rename-directory.js';

export function mapFilePaths(filePaths, { from, to }) {
  return new Map(
    filePaths.map((oldFilePath) => {
      const newFilePath = renameDirectory(oldFilePath, { from, to });

      return [oldFilePath, newFilePath];
    }),
  );
}
