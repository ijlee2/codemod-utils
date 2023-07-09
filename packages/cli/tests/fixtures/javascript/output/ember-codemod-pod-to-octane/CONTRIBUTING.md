# Contributing to ember-codemod-pod-to-octane

Open source projects like `ember-codemod-pod-to-octane` live on your words of encouragement and contribution. Please give feedback, report issues, or submit pull requests!

Here are some guidelines to help you and everyone else.


## Local development

<details>
<summary>Install dependencies</summary>

1. Fork and clone this repo.

    ```sh
    git clone git@github.com:<your GitHub handle>/ember-codemod-pod-to-octane.git
    ```

1. Change directory.

    ```sh
    cd ember-codemod-pod-to-octane
    ```

1. Use [`pnpm`](https://pnpm.io/installation) to install dependencies.

    ```sh
    pnpm install
    ```

</details>


<details>
<summary>Lint files</summary>

1. When you write code, please check that it meets the linting rules.

    ```sh
    pnpm lint
    ```

1. You can run `lint:fix` to automatically fix linting errors.

    ```sh
    pnpm lint:fix
    ```

</details>


<details>
<summary>Run tests</summary>

1. When you write code, please check that all tests continue to pass.

    ```sh
    pnpm test
    ```

</details>


<details>

<summary>Publish packages (for admins)</summary>

1. Generate a [personal access token](https://github.com/settings/tokens/) in GitHub, with default values for scopes (none selected).

1. Run the `changelog` script. This generates a text that you can add to `CHANGELOG.md`.

    ```sh
    GITHUB_AUTH=<YOUR_PERSONAL_ACCESS_TOKEN> pnpm changelog
    ```

1. The package follows [semantic versioning](https://semver.org/). Update the version in `package.json` accordingly.

1. Create a tag and provide release notes. The tag name should match the package version.

1. Publish the package.

    ```sh
    pnpm publish
    ```

</details>
