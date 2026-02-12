import { strict as assert } from 'node:assert';

import fixturify from 'fixturify';

import type { DirJSON, Options } from './types.js';

/**
 * Asserts that the codemod updated the input project correctly.
 *
 * Checks that all file names and contents specified in the `outputProject`
 * (expected) match those in the updated input project (actual).
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
