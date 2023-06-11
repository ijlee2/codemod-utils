import { strict as assert } from 'node:assert';

import fixturify, { type DirJSON } from 'fixturify';

type CodemodOptions = {
  projectRoot: string;
};

export function assertFixture(
  outputProject: DirJSON,
  codemodOptions: CodemodOptions,
): void {
  const { projectRoot } = codemodOptions;

  assert.deepStrictEqual(fixturify.readSync(projectRoot), outputProject);
}
