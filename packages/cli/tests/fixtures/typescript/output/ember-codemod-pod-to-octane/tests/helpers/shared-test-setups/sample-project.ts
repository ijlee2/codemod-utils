import { normalize } from 'node:path';

import type { CodemodOptions, Options } from '../../../src/types/index.js';

const codemodOptions: CodemodOptions = {
  projectRoot: normalize('tmp/sample-project'),
};

const options: Options = {
  projectRoot: normalize('tmp/sample-project'),
};

export { codemodOptions, options };
