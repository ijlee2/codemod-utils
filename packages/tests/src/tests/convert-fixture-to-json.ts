import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { DirJSON } from 'fixturify';
import { globSync } from 'glob';

function updateJson(
  json: DirJSON,
  { currentDirectory, keys }: { currentDirectory: string; keys: string[] },
) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const key = keys.shift()!;
  const isFile = keys.length === 0;

  if (isFile) {
    json[key] = readFileSync(join(currentDirectory, key), 'utf8');

    return;
  }

  if (!(key in json)) {
    json[key] = {} as DirJSON;
  }

  updateJson(json[key] as DirJSON, {
    currentDirectory: join(currentDirectory, key),
    keys,
  });
}

function createJson(
  filePaths: string[] = [],
  currentDirectory: string,
): DirJSON {
  const json: DirJSON = {};

  filePaths.forEach((filePath) => {
    const keys = filePath.split('/');

    updateJson(json, { currentDirectory, keys });
  });

  return json;
}

export function convertFixtureToJson(projectRoot: string): DirJSON {
  const currentDirectory = `${process.cwd()}/tests/fixtures/${projectRoot}`;

  const filePaths = globSync('**/*', {
    cwd: currentDirectory,
    dot: true,
    nodir: true,
  });

  return createJson(filePaths, currentDirectory);
}
