# Conclusion

First, give yourself a hearty pat for making it through. Writing a codemod is an advanced skill. You likely encountered and had to quickly grasp many new concepts.

To summarize what you learned:

- `codemod-utils` provides a set of tools and conventions to help you write codemods.

- Break a problem into small steps. There may be a sequence of steps that makes it easier to solve the problem.

- Before implementing the first step, create fixture projects and acceptance tests. You can then run `./update-test-fixtures.sh` to see the effect of your code change.

- Take the simplest approach to implement steps fast. Prefer duplication over premature abstraction.

- After implementing all steps, refactor code. Write integration and unit tests to improve documentation.
