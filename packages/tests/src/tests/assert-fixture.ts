import { strict as assert } from 'node:assert';

import fixturify from 'fixturify';

import type { DirJSON, Options } from '../types/index.js';

export function assertFixture(outputProject: DirJSON, options: Options): void {
  const { projectRoot } = options;

  assert.deepStrictEqual(fixturify.readSync(projectRoot), outputProject);
}
