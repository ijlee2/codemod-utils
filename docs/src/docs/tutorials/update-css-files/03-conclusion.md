# Conclusion

You can write a codemod to update CSS files, even when `@codemod-utils` doesn't provide a utility package for CSS yet.

As a concrete example, this tutorial showed how to use PostCSS along with `@codemod-utils/files`. Moreover, it highlighted the benefits of using existing plugins and having the option to write custom ones.

Depending on your use case, you may look into other libraries like [`css-tree`](https://github.com/csstree/csstree) (this is used by [`type-css-modules`](https://github.com/ijlee2/embroider-css-modules/tree/2.0.16/packages/type-css-modules)).
