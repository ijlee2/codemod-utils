import { existsSync, rmSync } from 'node:fs';

import fixturify, { type DirJSON } from 'fixturify';

type CodemodOptions = {
  projectRoot: string;
};

export function loadFixture(
  inputProject: DirJSON,
  codemodOptions: CodemodOptions,
): void {
  const { projectRoot } = codemodOptions;

  if (existsSync(projectRoot)) {
    rmSync(projectRoot, { recursive: true });
  }

  fixturify.writeSync(projectRoot, inputProject);
}
