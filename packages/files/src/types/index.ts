type FileContent = string;

type FileMap = Map<FilePath, FileContent>;

type FilePath = string;

type FilePathMap = Map<FilePath, FilePath>;

type Options = {
  [key: string]: unknown;
  projectRoot: string;
};

type ParsedPath = {
  base: string;
  dir: string;
  ext: string;
  name: string;
};

export type {
  FileContent,
  FileMap,
  FilePath,
  FilePathMap,
  Options,
  ParsedPath,
};
