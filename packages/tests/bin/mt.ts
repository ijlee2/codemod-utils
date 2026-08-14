#!/usr/bin/env node

import { run } from '@sondr3/minitest/dist/runner.js';

process.env['NODE_ENV'] = 'test';

void run(process.argv);
