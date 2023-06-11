type FileContent = string;

type FileMap = Map<FilePath, FileContent>;

type FilePath = string;

type FilePathMap = Map<FilePath, FilePath>;

type Options = {
  [key: string]: unknown;
  projectRoot: string;
};

export type { FileContent, FileMap, FilePath, FilePathMap, Options };
