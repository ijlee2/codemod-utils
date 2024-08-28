#!/usr/bin/env node
'use strict';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { createCodemod } from '../src/index.js';
import type { CodemodOptions } from '../src/types/index.js';

// Provide a title to the process in `ps`
process.title = '@codemod-utils/cli';

// Set codemod options
const argv = yargs(hideBin(process.argv))
  .option('addon', {
    choices: [
      'ast-javascript',
      'ast-template',
      'blueprints',
      'ember',
      'json',
    ] as const,
    describe: 'Optional @codemod-utils packages to install',
    type: 'array',
  })
  .option('name', {
    demandOption: true,
    describe: 'Name of your codemod',
    type: 'string',
  })
  .option('root', {
    describe: 'Where to run @codemod-utils/cli',
    type: 'string',
  })
  .option('typescript', {
    default: true,
    describe: 'Create a TypeScript project?',
    type: 'boolean',
  })
  .parseSync();

const codemodOptions: CodemodOptions = {
  addons: new Set(argv['addon']),
  hasTypeScript: argv['typescript'],
  name: argv['name'],
  projectRoot: argv['root'] ?? process.cwd(),
};

createCodemod(codemodOptions);
