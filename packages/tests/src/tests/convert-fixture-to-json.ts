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

export function convertFixtureToJson(projectRoot: string): DirJSON {
  const cwd = `${process.cwd()}/tests/fixtures/${projectRoot}`;

  const filePaths = globSync('**/*', {
    cwd,
    dot: true,
    nodir: true,
  });

  return createJson(filePaths, cwd);
}
