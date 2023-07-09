import { convertFixtureToJson } from '@codemod-utils/tests';

const inputProject = convertFixtureToJson('typescript-with-addons/input');
const outputProject = convertFixtureToJson('typescript-with-addons/output');

export { inputProject, outputProject };
