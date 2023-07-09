#!/usr/bin/env sh

#----------
#
#  A. Purpose
#
#    Fix all test fixtures after updating the source code.
#
#  B. Usage
#
#    ./codemod-test-fixtures.sh
#
#---------

# Compile TypeScript
<% if (options.codemod.hasTypeScript) { %>pnpm build<% } else { %># pnpm build<% } %>

./codemod-test-fixture.sh \
  -N "" \
  sample-project
