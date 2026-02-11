# Introduction

Windows handles file paths differently than POSIX-based operating systems do: It uses `\` instead of `/` for a path separator, and `\r\n` instead of `\n` for a line break. As a result, we need to watch out when we read files, write to them, and derive values from file paths (e.g. entity names in Ember).

`@codemod-utils/cli` provides a CI workflow that helps you check if the codemod will work on Windows. Having to support Windows may be a chore, but it will actually help you find wrong abstractions and write cleaner code.

This tutorial will show common pitfalls and what to do differently.
