import { convertFixtureToJson } from '@codemod-utils/tests';

const inputProject = convertFixtureToJson('javascript/input');
const outputProject = convertFixtureToJson('javascript/output');

export { inputProject, outputProject };
