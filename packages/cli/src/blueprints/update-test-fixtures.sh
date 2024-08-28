#!/usr/bin/env sh

#----------
#
#  A. Purpose
#
#    Fix all test fixtures after updating the source code.
#
#  B. Usage
#
#    ./update-test-fixtures.sh
#
#---------
<% if (options.codemod.hasTypeScript) { %>
# Compile TypeScript
pnpm build
<% } %>
# Update fixtures
rm -r "tests/fixtures/sample-project/output"
cp -r "tests/fixtures/sample-project/input" "tests/fixtures/sample-project/output"

./dist/bin/<%= options.codemod.name %>.js \
  --root "tests/fixtures/sample-project/output"
