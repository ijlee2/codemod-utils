import { MARKER } from './marker.js';

export function getTemplate(expression: unknown): string | undefined {
  // @ts-expect-error: Incorrect type
  if (expression.type !== 'CallExpression') {
    return;
  }

  if (
    // @ts-expect-error: Incorrect type
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expression.callee.type !== 'Identifier' ||
    // @ts-expect-error: Incorrect type
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expression.callee.name !== MARKER
  ) {
    return;
  }

  // @ts-expect-error: Incorrect type
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const template = expression.arguments[0].quasis[0].value.raw as string;

  return template;
}
