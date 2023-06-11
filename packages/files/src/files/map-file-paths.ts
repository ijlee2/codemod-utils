import type { FilePath } from '../types/index.js';
import { renamePathByDirectory } from './rename-path-by-directory.js';

type Options = {
  from: string;
  to: string;
};

export function mapFilePaths(filePaths: FilePath[], options: Options) {
  const { from, to } = options;

  return new Map(
    filePaths.map((oldFilePath) => {
      const newFilePath = renamePathByDirectory(oldFilePath, { from, to });

      return [oldFilePath, newFilePath];
    }),
  );
}
