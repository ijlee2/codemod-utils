import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { globSync } from 'glob';

import type { DirJSON } from '../types/index.js';

function updateJson(
  json: DirJSON,
  { cwd, keys }: { cwd: string; keys: string[] },
) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const key = keys.shift()!;
  const isFile = keys.length === 0;

  if (isFile) {
    json[key] = readFileSync(join(cwd, key), 'utf8');

    return;
  }

  if (!(key in json)) {
    json[key] = {} as DirJSON;
  }

  updateJson(json[key] as DirJSON, {
    cwd: join(cwd, key),
    keys,
  });
}

function createJson(filePaths: string[], cwd: string): DirJSON {
  const json: DirJSON = {};

  filePaths.forEach((filePath) => {
    const keys = filePath.split('/');

    updateJson(json, { cwd, keys });
  });

  return json;
}

/**
 * Reads the fixture (folders and files) at the specified path.
 * Returns a JSON representation to enable fixture-driven tests.
 *
 * @param projectRoot
 *
 * Where the fixture can be found, relative to the `tests/fixtures`
 * folder in the codemod project.
 *
 * @return
 *
 * A JSON, which can then be passed to `loadFixture()` or
 * `assertFixture()`.
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
export function convertFixtureToJson(projectRoot: string): DirJSON {
  const cwd = `${process.cwd()}/tests/fixtures/${projectRoot}`;

  const filePaths = globSync('**/*', {
    cwd,
    dot: true,
    nodir: true,
  });

  return createJson(filePaths, cwd);
}
