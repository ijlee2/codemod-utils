import { join } from 'node:path/posix';

import { getFilePath } from '@codemod-utils/blueprints';

const fileURL = import.meta.url;

export const blueprintsRoot = join(getFilePath(fileURL), '../../blueprints');
