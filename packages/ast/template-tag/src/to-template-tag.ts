/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { AST } from '@codemod-utils/ast-javascript';

const MARKER = 'template_fd9b2463e5f141cfb5666b64daa1f11a';

function getTemplateTag(expression: unknown): string | undefined {
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

  return `<template>${template}</template>`;
}

/**
 * Converts an ECMA file to show `<template>` tags.
 *
 * @requires
 *
 * module:@codemod-utils/ast-javascript
 *
 * @param file
 *
 * A `*.{gjs,gts}` file converted to ECMAScript.
 *
 * @return
 *
 * File with `<template>` tags.
 *
 * @example
 *
 * Update `*.{gjs,gts}` files.
 *
 * ```ts
 * // Some method that updates `*.{js,ts}` files
 * function transform(file: string): string {
 *   // ...
 * }
 *
 * file = toTemplateTag(transform(toEcma(file)));
 * ```
 */
export function toTemplateTag(ecma: string): string {
  const traverse = AST.traverse(true);

  const ast = traverse(ecma, {
    visitExportDefaultDeclaration(node) {
      const templateTag = getTemplateTag(node.value.declaration);

      if (templateTag === undefined) {
        this.traverse(node);

        return false;
      }

      return templateTag;
    },

    visitImportDeclaration(node) {
      if (
        node.value.source.type !== 'StringLiteral' ||
        node.value.source.value !== '@ember/template-compiler'
      ) {
        return false;
      }

      // For simplicity, always remove the import statement
      return null;
    },

    visitStaticBlock(node) {
      const bodyNode = node.value.body[0];

      if (bodyNode.type !== 'ExpressionStatement') {
        return false;
      }

      const templateTag = getTemplateTag(bodyNode.expression);

      if (templateTag === undefined) {
        return false;
      }

      return templateTag;
    },

    visitVariableDeclarator(node) {
      const templateTag = getTemplateTag(node.value.init);

      if (templateTag === undefined) {
        return false;
      }

      node.value.init = templateTag;

      return false;
    },
  });

  return AST.print(ast);
}
