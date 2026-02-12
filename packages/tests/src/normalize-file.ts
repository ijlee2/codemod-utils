import { EOL } from 'node:os';

/**
 * Creates a file (its content) with the correct newline character,
 * so that a test can pass on both POSIX and Windows.
 *
 * @param lines
 *
 * An array of texts.
 *
 * @return
 *
 * A string that represents the file content.
 *
 * @example
 *
 * Assert that `transform` correctly updates a file.
 *
 * ```ts
 * const oldFile = normalizeFile([
 *   `import Component from '@glimmer/component';`,
 *   ``,
 *   `export default class Hello extends Component {}`,
 *   ``,
 * ]);
 *
 * const newFile = transform(oldFile);
 *
 * assert.strictEqual(
 *   newFile,
 *   normalizeFile([
 *     `import Component from '@glimmer/component';`,
 *     ``,
 *     `import styles from './hello.module.css';`,
 *     ``,
 *     `export default class Hello extends Component {`,
 *     `  styles = styles;`,
 *     `}`,
 *     ``,
 *   ]),
 * );
 * ```
 */
export function normalizeFile(lines: string[]): string {
  return lines.join(EOL);
}
