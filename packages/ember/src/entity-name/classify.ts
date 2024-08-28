/* https://github.com/ember-cli/ember-cli-string-utils/blob/v1.1.0/index.js */
/* https://github.com/emberjs/ember.js/blob/v5.3.0/blueprints/component/index.js#L255-L256 */
import { camelize } from './camelize.js';

/**
 * Returns a string that can be used to name a JavaScript `class`
 * (a.k.a. Pascal case).
 *
 * @param value
 *
 * A string (an entity name).
 *
 * @return
 *
 * The string in Pascal case.
 *
 * @example
 *
 * ```ts
 * const newValue = classify('ui/button');
 *
 * // 'UiButton'
 * ```
 */
export function classify(value: string): string {
  const tokens = value.replace(/\//g, '-').split('.');

  const tokensTransformed = tokens.map((token) => {
    const camelized = camelize(token);

    return camelized.charAt(0).toUpperCase() + camelized.substring(1);
  });

  return tokensTransformed.join('.');
}
