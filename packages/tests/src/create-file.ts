import { EOL } from 'node:os';

/**
 * Creates a file (its content) from an array of strings.
 * The output works on POSIX and Windows.
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
 * Assert that the codemod updated the fixture correctly.
 *
 * ```ts
 * const oldFile = createFile([
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
 *   createFile([
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
export function createFile(lines: string[]): string {
  return lines.join(EOL);
}
