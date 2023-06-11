import { renamePathByDirectory } from './rename-path-by-directory.js';

export function mapFilePaths(filePaths, { from, to }) {
  return new Map(
    filePaths.map((oldFilePath) => {
      const newFilePath = renamePathByDirectory(oldFilePath, { from, to });

      return [oldFilePath, newFilePath];
    }),
  );
}
