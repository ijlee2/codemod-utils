import { existsSync, rmSync } from 'node:fs';

import fixturify from 'fixturify';

import type { DirJSON, Options } from '../types/index.js';

export function loadFixture(inputProject: DirJSON, options: Options): void {
  const { projectRoot } = options;

  if (existsSync(projectRoot)) {
    rmSync(projectRoot, { recursive: true });
  }

  fixturify.writeSync(projectRoot, inputProject);
}
