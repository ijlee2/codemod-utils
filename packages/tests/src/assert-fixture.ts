import { strict as assert } from 'node:assert';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';

import type { DirJSON, Options } from './types.js';

function addFile(project: DirJSON, path: string, fileContent: string): void {
  const segments = path.split(sep);
  const fileName = segments.pop()!;

  addFolder(project, segments)[fileName] = fileContent;
}

function addFolder(project: DirJSON, path: string | string[]): DirJSON {
  const segments = Array.isArray(path) ? path : path.split(sep);

  segments.forEach((segment) => {
    const value = project[segment];

    if (value === undefined) {
      project[segment] = {};
      project = project[segment];
    } else if (typeof value === 'object') {
      project = value;
    }
  });

  return project;
}

function getProject(projectRoot: string): DirJSON {
  const project: DirJSON = {};

  const fileOrFolderPaths = readdirSync(projectRoot, {
    recursive: true,
  }).sort();

  fileOrFolderPaths.forEach((fileOrFolderPath) => {
    if (typeof fileOrFolderPath !== 'string') {
      return;
    }

    const destination = join(projectRoot, fileOrFolderPath);
    const stat = statSync(destination);

    if (stat.isFile()) {
      const fileContent = readFileSync(destination, 'utf8');

      addFile(project, fileOrFolderPath, fileContent);
    } else {
      addFolder(project, fileOrFolderPath);
    }
  });

  return project;
}

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

  assert.deepStrictEqual(getProject(projectRoot), outputProject);
}
