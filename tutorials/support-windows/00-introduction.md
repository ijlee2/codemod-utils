# Introduction

Extra attention is needed when you read or write files, or derive values (e.g. entity names in Ember) from file paths. This is because Windows handles file paths differently than POSIX: It uses `\` instead of `/` for a path separator, and `\r\n` instead of `\n` for a line break.

By supporting Windows, you can remove wrong abstractions and write cleaner code. This tutorial will show common pitfalls and what to do differently.


## Table of contents

1. [Beware of file paths](./01-beware-of-file-paths.md)
1. [Beware of line breaks](./02-beware-of-line-breaks.md)
