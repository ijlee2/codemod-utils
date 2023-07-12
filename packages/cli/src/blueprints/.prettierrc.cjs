'use strict';

module.exports = {
  overrides: [
    {
      <% if (options.codemod.hasTypeScript) { %>files: '*.{cjs,cts,js,mjs,mts,ts}',<% } else { %>files: '*.{cjs,js,mjs}',<% } %>
      options: {
        printWidth: 80,
        singleQuote: true,
      },
    },
  ],
};
