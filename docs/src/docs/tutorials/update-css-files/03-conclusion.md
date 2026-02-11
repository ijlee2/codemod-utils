# Conclusion

You can write a codemod to update CSS files, even when `codemod-utils` doesn't provide a dedicated package. As a concrete example, this tutorial used `postcss` and `postcss-nested`. Moreover, it highlighted the benefit of using an existing solution, while having the option to write a custom one.

Depending on your use case, you may look into another library like [`css-tree`](https://github.com/csstree/csstree) (used by [`type-css-modules`](https://github.com/ijlee2/embroider-css-modules/tree/2.0.16/packages/type-css-moduleshttps://github.com/ijlee2/embroider-css-modules/blob/main/packages/type-css-modules/README.md)).
