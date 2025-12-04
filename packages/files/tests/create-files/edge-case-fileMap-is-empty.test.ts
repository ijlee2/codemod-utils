import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import {
  createFiles,
  type FileContent,
  type FilePath,
} from '../../src/index.js';
import { codemodOptions, options } from '../helpers/index.js';

test('create-files > edge case (fileMap is empty)', function () {
  const inputProject = {};

  const outputProject = {};

  loadFixture(inputProject, codemodOptions);

  const fileMap = new Map<FilePath, FileContent>();

  createFiles(fileMap, options);

  assertFixture(outputProject, codemodOptions);
});
