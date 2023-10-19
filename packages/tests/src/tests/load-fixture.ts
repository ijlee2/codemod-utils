import { existsSync, rmSync } from 'node:fs';

import fixturify from 'fixturify';

import type { DirJSON, Options } from '../types/index.js';

/**
 * Creates a fixture (folders and files) at the specified path.
 *
 * @param inputProject
 *
 * The folders and files that we want to create, represented as a
 * JSON (possibly nested).
 *
 * The object keys are the folder and file names. The object values
 * are either a JSON (in the case of a folder key) or a string that
 * stores the file content (in the case of a file key).
 *
 * @param options
 *
 * An object with `projectRoot`. Here, `projectRoot` denotes where
 * we want to create the fixture for a test. (This is somewhere in
 * the `tmp` folder.)
 *
 * @example
 *
 * Assert that the codemod updated the fixture correctly.
 *
 * ```ts
 * const inputProject = convertFixtureToJson('sample-project/input');
 *
 * const outputProject = convertFixtureToJson('sample-project/output');
 *
 * loadFixture(inputProject, codemodOptions);
 *
 * runCodemod(codemodOptions);
 *
 * assertFixture(outputProject, codemodOptions);
 * ```
 */
export function loadFixture(inputProject: DirJSON, options: Options): void {
  const { projectRoot } = options;

  if (existsSync(projectRoot)) {
    rmSync(projectRoot, { recursive: true });
  }

  fixturify.writeSync(projectRoot, inputProject);
}
