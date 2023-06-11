import {
  type AST,
  builders,
  type NodeVisitor,
  print,
  transform,
} from 'ember-template-recast';

function _traverse() {
  return function (file: string, visitMethods: NodeVisitor = {}): AST.Template {
    const { ast } = transform({
      plugin() {
        return visitMethods;
      },
      template: file,
    });

    return ast;
  };
}

const tools = {
  builders,
  print,
  traverse: _traverse,
};

export default tools;
