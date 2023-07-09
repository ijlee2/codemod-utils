import { convertFixtureToJson } from '@codemod-utils/tests';

const inputProject = convertFixtureToJson('javascript-with-addons/input');
const outputProject = convertFixtureToJson('javascript-with-addons/output');

export { inputProject, outputProject };
