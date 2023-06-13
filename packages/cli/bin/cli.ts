#!/usr/bin/env node
// eslint-disable-next-line n/shebang
'use strict';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { createCodemod } from '../src/migration/index.js';
import type { CodemodOptions } from '../src/types/index.js';

// Provide a title to the process in `ps`
process.title = '@codemod-utils/cli';

// Set codemod options
const argv = yargs(hideBin(process.argv))
  .option('root', {
    describe: 'Location of your codemod',
    type: 'string',
  })
  .parseSync();

const codemodOptions: CodemodOptions = {
  projectRoot: argv['root'] ?? process.cwd(),
};

createCodemod(codemodOptions);
