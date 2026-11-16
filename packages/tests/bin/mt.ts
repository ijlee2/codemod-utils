#!/usr/bin/env node

import { run } from '@sondr3/minitest';

process.env['NODE_ENV'] = 'test';

void run(process.argv);
