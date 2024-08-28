type Addon =
  | 'ast-javascript'
  | 'ast-template'
  | 'blueprints'
  | 'ember'
  | 'json';

type CodemodOptions = {
  addons: Set<Addon>;
  hasTypeScript: boolean;
  name: string;
  projectRoot: string;
};

type Options = {
  codemod: {
    addons: Set<Addon>;
    hasTypeScript: boolean;
    name: string;
  };
  projectRoot: string;
};

export type { CodemodOptions, Options };
