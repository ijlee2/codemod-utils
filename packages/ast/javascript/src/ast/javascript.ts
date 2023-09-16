import { parse as babelParser, type ParserOptions } from '@babel/parser';
import {
  type Options as formattingOptions,
  parse,
  print,
  types,
  visit,
} from 'recast';

/* https://github.com/benjamn/recast/blob/v0.23.4/lib/options.ts#L7 */
const formattingOptions: formattingOptions = {
  quote: 'single',
};

/* https://github.com/facebook/jscodeshift/blob/v0.15.0/parser/babel5Compat.js#L15 */
const jsOptions: ParserOptions = {
  sourceType: 'module',
  allowHashBang: true,
  ecmaVersion: Infinity,
  allowImportExportEverywhere: true,
  allowReturnOutsideFunction: true,
  startLine: 1,
  tokens: true,
  plugins: [
    'estree',
    'jsx',
    'asyncGenerators',
    'classProperties',
    'doExpressions',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore Type '"exportExtensions"' is not assignable to type 'PluginConfig'.
    'exportExtensions',
    'functionBind',
    'functionSent',
    'objectRestSpread',
    'dynamicImport',
    'nullishCoalescingOperator',
    'optionalChaining',
    ['decorators', { decoratorsBeforeExport: true }],
  ],
};

/* https://github.com/facebook/jscodeshift/blob/v0.15.0/parser/tsOptions.js#L14 */
const tsOptions: ParserOptions = {
  sourceType: 'module',
  allowImportExportEverywhere: true,
  allowReturnOutsideFunction: true,
  startLine: 1,
  tokens: true,
  plugins: [
    'asyncGenerators',
    'bigInt',
    'classPrivateMethods',
    'classPrivateProperties',
    'classProperties',
    'decorators-legacy',
    'doExpressions',
    'dynamicImport',
    'exportDefaultFrom',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore Type '"exportExtensions"' is not assignable to type 'PluginConfig'.
    'exportExtensions',
    'exportNamespaceFrom',
    'functionBind',
    'functionSent',
    'importMeta',
    'nullishCoalescingOperator',
    'numericSeparator',
    'objectRestSpread',
    'optionalCatchBinding',
    'optionalChaining',
    ['pipelineOperator', { proposal: 'minimal' }],
    'throwExpressions',
    'typescript',
  ],
};

function getParseOptions(isTypeScript?: boolean) {
  const options = isTypeScript ? tsOptions : jsOptions;

  return {
    parser: {
      parse(file: string) {
        return babelParser(file, options);
      },
    },
  };
}

function _print(ast: types.ASTNode): string {
  const { code } = print(ast, formattingOptions);

  return code;
}

function _traverse(isTypeScript?: boolean) {
  return function (
    file: string,
    visitMethods: types.Visitor = {},
  ): types.ASTNode {
    const ast = parse(file, getParseOptions(isTypeScript)) as types.ASTNode;

    visit(ast, visitMethods);

    return ast;
  };
}

type Tools = {
  builders: typeof types.builders;
  print: typeof _print;
  traverse: typeof _traverse;
};

const tools: Tools = {
  builders: types.builders,
  print: _print,
  traverse: _traverse,
};

export default tools;
