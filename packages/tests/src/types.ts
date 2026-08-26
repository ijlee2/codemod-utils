type FileContent = string;

type FileOrFolderName = string;

type DirJSON = {
  [fileOrFolderName: FileOrFolderName]: DirJSON | FileContent;
};

type Options = {
  [key: string]: unknown;
  projectRoot: string;
};

export type { DirJSON, Options };
