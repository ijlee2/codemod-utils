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

# Compile TypeScript
pnpm build

# Update fixtures
rm -r "tests/fixtures/javascript/output"
cp -r "tests/fixtures/javascript/input" "tests/fixtures/javascript/output"

./dist/bin/cli.js \
  --name ember-codemod-pod-to-octane \
  --root "tests/fixtures/javascript/output" \
  --typescript false

rm -r "tests/fixtures/javascript-with-addons/output"
cp -r "tests/fixtures/javascript-with-addons/input" "tests/fixtures/javascript-with-addons/output"

./dist/bin/cli.js \
  --addon ast-javascript ast-template blueprints ember json \
  --name ember-codemod-args-to-signature \
  --root "tests/fixtures/javascript-with-addons/output" \
  --typescript false

rm -r "tests/fixtures/typescript/output"
cp -r "tests/fixtures/typescript/input" "tests/fixtures/typescript/output"

./dist/bin/cli.js \
  --name ember-codemod-pod-to-octane \
  --root "tests/fixtures/typescript/output"

rm -r "tests/fixtures/typescript-with-addons/output"
cp -r "tests/fixtures/typescript-with-addons/input" "tests/fixtures/typescript-with-addons/output"

./dist/bin/cli.js \
  --addon ast-javascript ast-template blueprints ember json \
  --name ember-codemod-args-to-signature \
  --root "tests/fixtures/typescript-with-addons/output"
