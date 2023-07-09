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
pnpm build

./codemod-test-fixture.sh \
  -N "--name ember-codemod-pod-to-octane --typescript false" \
  javascript

./codemod-test-fixture.sh \
  -N "--addon ast-javascript ast-template blueprints ember-cli-string json --name ember-codemod-args-to-signature --typescript false" \
  javascript-with-addons

./codemod-test-fixture.sh \
  -N "--name ember-codemod-pod-to-octane" \
  typescript

./codemod-test-fixture.sh \
  -N "--addon ast-javascript ast-template blueprints ember-cli-string json --name ember-codemod-args-to-signature" \
  typescript-with-addons
