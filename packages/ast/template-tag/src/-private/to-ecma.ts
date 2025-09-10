/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { AST } from '@codemod-utils/ast-javascript';

import { getTemplate, preprocessor } from './content-tag.js';

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

export function findMarkers(file: string): Marker[] {
  const { code } = preprocessor.process(file);
  const traverse = AST.traverse(true);

  const markers: Marker[] = [];

  traverse(code, {
    visitExportDefaultDeclaration(node) {
      const template = getTemplate(node.value.declaration);

      if (template === undefined) {
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

      const template = getTemplate(bodyNode.expression);

      if (template === undefined) {
        return false;
      }

      markers.push(getMarker(node.value));

      return false;
    },

    visitVariableDeclarator(node) {
      const template = getTemplate(node.value.init);

      if (template === undefined) {
        return false;
      }

      markers.push(getMarker(node.value.init));

      return false;
    },
  });

  return markers.sort(sortMarkers);
}
