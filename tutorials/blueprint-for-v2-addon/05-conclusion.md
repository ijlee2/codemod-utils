# Conclusion

You have learned how blueprints help you create or update files in a project. The blueprint files can be static (the content is always the same) or dynamic (the content differs, depending on the circumstances).

You might also understand better why `codemodOptions` and `options` exist, as well as which related files to update, should you decide to provide users more codemod options.

For brevity, our `blueprint-for-v2-addon` created only 1 file in the addon and the test app. To familiarize yourself with delimiters (in particular, with evaluate and interpolate), I encourage you to extend the project and add more blueprint files. You can also explore how to write integration tests for the `create-files-from-blueprints` step.
