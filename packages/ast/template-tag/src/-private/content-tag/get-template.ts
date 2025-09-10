/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { MARKER } from './marker.js';

export function getTemplate(expression: unknown): string | undefined {
  // @ts-expect-error: Incorrect type
  if (expression.type !== 'CallExpression') {
    return;
  }

  if (
    // @ts-expect-error: Incorrect type
    expression.callee.type !== 'Identifier' ||
    // @ts-expect-error: Incorrect type
    expression.callee.name !== MARKER
  ) {
    return;
  }

  // @ts-expect-error: Incorrect type
  const template = expression.arguments[0].quasis[0].value.raw as string;

  return template;
}
