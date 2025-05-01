import { strict as assert } from 'node:assert';

// eslint-disable-next-line import-x/default
import fixturify from 'fixturify';

import type { DirJSON, Options } from '../types/index.js';

/**
 * Checks that the fixture at the specified path has the right shape.
 *
 * @param outputProject
 *
 * The folders and files that we expect to see, represented as a
 * JSON (possibly nested).
 *
 * The object keys are the folder and file names. The object values
 * are either a JSON (in the case of a folder key) or a string that
 * stores the file content (in the case of a file key).
 *
 * @param options
 *
 * An object with `projectRoot`. Here, `projectRoot` denotes where
 * we created the fixture for a test. (This is somewhere in the `tmp`
 * folder.)
 *
 * @return
 *
 * Returns `true`, if and only if, all folders and files are present
 * and all file contents are correct.
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
export function assertFixture(outputProject: DirJSON, options: Options): void {
  const { projectRoot } = options;

  assert.deepStrictEqual(fixturify.readSync(projectRoot), outputProject);
}
