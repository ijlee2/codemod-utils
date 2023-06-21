/* https://github.com/emberjs/ember.js/blob/v4.12.1/blueprints/component-test/index.js#L13-L16 */
import { classify } from './classify.js';

export function doubleColonize(value: string): string {
  const tokens = value.split('/');

  const tokensTransformed = tokens.map(classify);

  return tokensTransformed.join('::');
}
