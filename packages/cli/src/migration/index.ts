import type { CodemodOptions } from '../types/index.js';
import {
  createFilesFromBlueprints,
  createOptions,
  updatePackageJson,
} from './steps/index.js';

export function createCodemod(codemodOptions: CodemodOptions): void {
  const options = createOptions(codemodOptions);

  createFilesFromBlueprints(options);
  updatePackageJson(options);
}
