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

# Update fixtures
rm -r "tests/fixtures/sample-project/output"
cp -r "tests/fixtures/sample-project/input" "tests/fixtures/sample-project/output"

./dist/bin/ember-codemod-args-to-signature.js \
  --root "tests/fixtures/sample-project/output"