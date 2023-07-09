import { chmodSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { processTemplate } from '@codemod-utils/blueprints';
import { createFiles, findFiles } from '@codemod-utils/files';

import type { Options } from '../../types/index.js';
import { blueprintsRoot } from '../../utils/blueprints.js';

function getFilesToSkip(options: Options): string[] {
  const { codemod } = options;

  const files = new Set<string>();

  if (!codemod.addons.has('blueprints')) {
    files.add('src/blueprints/.gitkeep');
    files.add('src/utils/blueprints/blueprints-root.__js__');
    files.add('src/utils/blueprints.__js__');
    files.add('tests/utils/blueprints/blueprints-root.test.__js__');
  }

  if (!codemod.hasTypeScript) {
    files.add('__build.sh__');
    files.add('src/types/index.ts');
    files.add('tsconfig.build.json');
    files.add('tsconfig.json');
  }

  return Array.from(files);
}

function resolveBlueprintFilePath(
  blueprintFilePath: string,
  options: Options,
): string {
  const { codemod } = options;

  return blueprintFilePath
    .replace('__codemod-name__', codemod.name)
    .replace('__eslintignore__', '.eslintignore')
    .replace('__eslintrc.cjs__', '.eslintrc.cjs')
    .replace('__gitignore__', '.gitignore')
    .replace('__npmignore__', '.npmignore')
    .replace('__prettierrc.cjs__', '.prettierrc.cjs')
    .replace('__build.sh__', 'build.sh')
    .replace('__codemod-test-fixture.sh__', 'codemod-test-fixture.sh')
    .replace('__codemod-test-fixtures.sh__', 'codemod-test-fixtures.sh')
    .replace('__CONTRIBUTING.md__', 'CONTRIBUTING.md')
    .replace('.__js__', codemod.hasTypeScript ? '.ts' : '.js');
}

function updateFilePermissions(options: Options) {
  const { codemod, projectRoot } = options;

  const files = new Set([
    'codemod-test-fixture.sh',
    'codemod-test-fixtures.sh',
  ]);

  if (codemod.hasTypeScript) {
    files.add(`bin/${codemod.name}.ts`);
    files.add('build.sh');
  } else {
    files.add(`bin/${codemod.name}.js`);
  }

  Array.from(files).forEach((file) => {
    const filePath = join(projectRoot, codemod.name, file);

    chmodSync(filePath, 0o755);
  });
}

export function createFilesFromBlueprints(options: Options): void {
  const { codemod } = options;

  const filesToSkip = getFilesToSkip(options);

  const blueprintFilePaths = findFiles('**/*', {
    ignoreList: filesToSkip,
    projectRoot: blueprintsRoot,
  });

  const fileMap = new Map(
    blueprintFilePaths.map((blueprintFilePath) => {
      const filePath = join(
        codemod.name,
        resolveBlueprintFilePath(blueprintFilePath, options),
      );

      const blueprintFile = readFileSync(
        join(blueprintsRoot, blueprintFilePath),
        'utf8',
      );

      const file = processTemplate(blueprintFile, {
        options,
      });

      return [filePath, file];
    }),
  );

  createFiles(fileMap, options);
  updateFilePermissions(options);
}
