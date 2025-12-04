import template from 'lodash/template.js';

/**
 * Returns the blueprint file after filling it out with data.
 *
 * @param file
 *
 * A blueprint file, which may contain escape, evaluate, and
 * interpolate delimiters.
 *
 * - Escape (`<%- %>`) - escape an HTML code
 * - Evaluate (`<% %>`) - evaluate a JavaScript code
 * - Interpolate (`<%= %>`) - substitute a value
 *
 * @param data
 *
 * An object that provides the data needed for the file.
 *
 * @return
 *
 * The processed blueprint file.
 *
 * @example
 *
 * First, create a blueprint file.
 *
 * ```ts
 * // blueprints/__testAppLocation__/ember-cli-build.js
 * 'use strict';
 *
 * const EmberApp = require('ember-cli/lib/broccoli/ember-app');
 *
 * module.exports = function (defaults) {
 *   const app = new EmberApp(defaults, {
 *     // Add options here
 *     autoImport: {
 *       watchDependencies: ['<%= addon.name %>'],
 *     },<% if (testApp.hasTypeScript) { %>
 *     'ember-cli-babel': {
 *       enableTypeScriptTransform: true,
 *     },<% } %>
 *   });
 *
 *   const { maybeEmbroider } = require('@embroider/test-setup');
 *
 *   return maybeEmbroider(app);
 * };
 * ```
 *
 * Then, pass data to the file.
 *
 * ```ts
 * import { readFileSync } from 'node:fs';
 * import { join } from 'node:path/posix';
 *
 * // Read file
 * const blueprintFilePath = '__testAppLocation__/ember-cli-build.js';
 *
 * const blueprintFile = readFileSync(
 *   join(blueprintsRoot, blueprintFilePath),
 *   'utf8',
 * );
 *
 * // Process file
 * processTemplate(blueprintFile, {
 *   addon: {
 *     name: 'ember-container-query',
 *   },
 *   app: {
 *     hasTypeScript: true,
 *   },
 * });
 * ```
 */
export function processTemplate(file: string, data?: object): string {
  const settings = {
    escape: /<%-([\s\S]+?)%>/g,
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
  };

  return template(file, settings)(data);
}
