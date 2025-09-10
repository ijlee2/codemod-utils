/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { AST } from '@codemod-utils/ast-javascript';
import { Preprocessor } from 'content-tag';

export const MARKER = 'template_fd9b2463e5f141cfb5666b64daa1f11a';

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

type Marker = {
  code: string;
  end: {
    column: number;
    index: number;
    line: number;
    token: number;
  };
};

function getMarker(nodeValue: unknown): Marker {
  return {
    // @ts-expect-error: Incorrect type
    code: AST.print(nodeValue),
    // @ts-expect-error: Incorrect type
    end: nodeValue.loc.end,
  };
}

function sortMarkers(a: Marker, b: Marker): number {
  if (a.end.line > b.end.line) {
    return -1;
  }

  if (a.end.line < b.end.line) {
    return 1;
  }

  if (a.end.column > b.end.column) {
    return -1;
  }

  if (a.end.column < b.end.column) {
    return 1;
  }

  return 0;
}

const preprocessor = new Preprocessor();

export function findMarkers(file: string): Marker[] {
  const { code } = preprocessor.process(file);
  const traverse = AST.traverse(true);

  const markers: Marker[] = [];

  traverse(code, {
    visitExportDefaultDeclaration(node) {
      const templateTag = getTemplateTag(node.value.declaration);

      if (templateTag === undefined) {
        this.traverse(node);

        return false;
      }

      markers.push(getMarker(node.value));

      return false;
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

      markers.push(getMarker(node.value));

      return false;
    },

    visitVariableDeclarator(node) {
      const templateTag = getTemplateTag(node.value.init);

      if (templateTag === undefined) {
        return false;
      }

      markers.push(getMarker(node.value.init));

      return false;
    },
  });

  return markers.sort(sortMarkers);
}
