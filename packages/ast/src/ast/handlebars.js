import { builders, print, transform } from 'ember-template-recast';

function traverse(file, visitMethods = {}) {
  const { ast } = transform({
    plugin() {
      return visitMethods;
    },
    template: file,
  });

  return ast;
}

const tools = {
  builders,
  print,
  traverse,
};

export default tools;
