/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { AST } from '@codemod-utils/ast-javascript';

import { getTemplate } from './content-tag.js';

export function removeMarkers(file: string): string {
  const traverse = AST.traverse(true);

  const ast = traverse(file, {
    visitExportDefaultDeclaration(node) {
      const template = getTemplate(node.value.declaration);

      if (template === undefined) {
        this.traverse(node);

        return false;
      }

      return `<template>${template}</template>`;
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

      const template = getTemplate(bodyNode.expression);

      if (template === undefined) {
        return false;
      }

      return `<template>${template}</template>`;
    },

    visitVariableDeclarator(node) {
      const template = getTemplate(node.value.init);

      if (template === undefined) {
        return false;
      }

      node.value.init = `<template>${template}</template>`;

      return false;
    },
  });

  return AST.print(ast);
}
