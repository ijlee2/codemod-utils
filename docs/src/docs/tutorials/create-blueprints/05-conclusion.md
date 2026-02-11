# Conclusion

You can now use blueprints to create and update files. Blueprints can be static (the content is always the same) or dynamic (the content differs, depending on some data).

You can also perhaps see better why two separate values (`codemodOptions` and `options`) exist to represent a codemod's options. Furthemore, which files in `/src` to update, if you want to provide end-developers more options.

For brevity, our `create-v2-addon-repo` created only 1 file in the addon and the test app. To familiarize yourself with delimiters (in particular, with evaluate and interpolate), I encourage you to extend the codemod and add more blueprint files. You can also explore how to write integration tests for the `create-files-from-blueprints` step.
