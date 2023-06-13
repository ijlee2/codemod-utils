import { convertFixtureToJson } from '@codemod-utils/tests';

const inputProject = convertFixtureToJson('typescript/input');
const outputProject = convertFixtureToJson('typescript/output');

export { inputProject, outputProject };
