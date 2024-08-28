/* https://github.com/emberjs/ember.js/blob/v5.3.0/blueprints/component-test/index.js#L13-L16 */
import { classify } from './classify.js';

/**
 * Returns a string associated with the angle bracket syntax
 * for components.
 *
 * @param value
 *
 * A string (an entity name).
 *
 * @return
 *
 * The string with double colon(s) (`::`).
 *
 * @example
 *
 * ```ts
 * const newValue = doubleColonize('ui/button');
 *
 * // 'Ui::Button'
 * ```
 */
export function doubleColonize(value: string): string {
  const tokens = value.split('/');

  const tokensTransformed = tokens.map(classify);

  return tokensTransformed.join('::');
}
