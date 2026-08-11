import type { DefaultTheme } from 'vitepress/theme';

function boostDocument(documentId: string, term: string): number {
  const [url, _sectionId] = documentId.split('#') as [
    string,
    string | undefined,
  ];

  const path = url.replace('/docs', '');

  const PRIORITIZED_PATHS: Record<string, string> = {
    astjavascript: '/packages/codemod-utils-ast-javascript',
    asttemplate: '/packages/codemod-utils-ast-template',
    asttemplatetag: '/packages/codemod-utils-ast-template-tag',
    blueprints: '/packages/codemod-utils-blueprints',
    cli: '/packages/codemod-utils-cli',
    ember: '/packages/codemod-utils-ember',
    files: '/packages/codemod-utils-files',
    packagejson: '/packages/codemod-utils-package-json',
    tests: '/packages/codemod-utils-tests',
    threads: '/packages/codemod-utils-threads',
  };

  const prioritizedPath = PRIORITIZED_PATHS[term.toLowerCase()];

  if (prioritizedPath) {
    return path === prioritizedPath ? 10 : 0;
  }

  if (path === '/') {
    return 0.5;
  }

  if (path === '/quickstart') {
    return 3;
  }

  if (path.startsWith('/packages/')) {
    return 5;
  }

  if (path.startsWith('/tutorials/create-blueprints/')) {
    return 1.5;
  }

  if (path.startsWith('/tutorials/main-tutorial/')) {
    return 3;
  }

  if (path.startsWith('/tutorials/support-windows/')) {
    return 1.5;
  }

  if (path.startsWith('/tutorials/update-css-files/')) {
    return 1.5;
  }

  if (path.startsWith('/tutorials/update-template-tags/')) {
    return 1.5;
  }

  return 1;
}

function tokenize(text: string): string[] {
  /*
    MiniSearch's default tokenizer splits on whitespace and punctuation only, so
    an API name like `formatDateRange` is indexed as a single term. We split
    camelCase names as well, so that someone who searches for "date range" or
    "primary locale" lands on the same pages that `formatDateRange` and
    `primaryLocale` do.
  */
  const SPACE = /[\n\r\p{Z}]+/u;

  const PUNCTUATION = /\p{P}+/u;

  const CAMEL_CASE_BOUNDARY =
    /(?<=[\p{Ll}\p{N}])(?=\p{Lu})|(?<=\p{Lu})(?=\p{Lu}\p{Ll})/u;

  const tokens: string[] = [];

  for (const chunk of text.split(SPACE)) {
    const words = chunk.split(PUNCTUATION).filter((word) => word !== '');

    for (const word of words) {
      // Keep the whole name, so that searching for `formatDateRange` still works
      tokens.push(word);

      const parts = word.split(CAMEL_CASE_BOUNDARY);

      if (parts.length > 1) {
        tokens.push(...parts);
      }
    }

    /*
      Join what punctuation split apart, so that `format-date-range` produces
      the same `formatdaterange` token that `formatDateRange` does. Both
      spellings of a name then lead to the same page. (A user who types the
      words with a space instead, `format date range`, still gets the looser,
      word-by-word match.)
    */
    if (words.length > 1) {
      tokens.push(words.join(''));
    }
  }

  return tokens;
}

export const miniSearch: NonNullable<
  DefaultTheme.LocalSearchOptions['miniSearch']
> = {
  options: {
    tokenize,
  },
  searchOptions: {
    boostDocument,
  },
};
