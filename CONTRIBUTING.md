# Contributing to @codemod-utils

Open source projects like `@codemod-utils` live on your words of encouragement and contribution. Please give feedback, report issues, or submit pull requests!

Here are some guidelines to help you and everyone else.


## Local development

<details>

<summary>Install dependencies</summary>

1. Fork and clone this repo.

    ```sh
    git clone git@github.com:<your-github-handle>/codemod-utils.git
    ```

1. Change directory.

    ```sh
    cd codemod-utils
    ```

1. Use [`pnpm`](https://pnpm.io/installation) to install dependencies.

    ```sh
    pnpm install
    ```

</details>


<details>

<summary>Check and fix errors</summary>

1. As you write code, please check that it meets formatting and linting rules.

    ```sh
    # From the workspace root
    pnpm lint
    ```

1. You can run `lint:fix` to fix errors.

    ```sh
    # From the workspace root
    pnpm lint:fix
    ```

</details>


<details>

<summary>Run tests</summary>

1. When you write code, please check that all tests continue to pass.

    ```sh
    # From the workspace root
    pnpm test
    ```

</details>


<details>

<summary>Add changeset to pull request</code></summary>

1. To record how a pull request affects packages, you will want to add a changeset.

    The changeset provides a summary of the code change. It also describes how package versions should be updated (major, minor, or patch) as a result of the code change.

    ```sh
    # From the workspace root
    pnpm changeset
    ```

</details>


<details>

<summary>Publish packages (for admins)</summary>

1. Generate a [personal access token](https://github.com/settings/tokens/) in GitHub, with `repo` and `read:user` scopes enabled. This token will be used to retrieve pull request information.

1. Run the `release:prepare` script. This removes changesets, updates package versions, and updates `CHANGELOG`s.

    ```sh
    # From the workspace root
    GITHUB_TOKEN=<YOUR_PERSONAL_ACCESS_TOKEN> pnpm release:prepare
    ```

    Note, `release:prepare` also updated the workspace root's version (e.g. from `0.1.1` to `0.1.2`). We will use it to name the tag that will be published.

1. Review the file changes. Commit them in a branch, then open a pull request to merge the changes to the `main` branch.

    ```sh
    # From the workspace root
    git checkout -b tag-0.1.2
    git add .
    git commit -m "Tagged 0.1.2"
    git push origin tag-0.1.2
    ```

1. [Create a tag](https://github.com/ijlee2/codemod-utils/releases/new) and provide release notes. The tag name should match the workspace root's version (e.g. `0.1.2`).

1. Publish the packages.

    ```sh
    # From the workspace root
    pnpm release:publish
    ```

</details>


## How can I help?

If you haven't before, I encourage you to watch [Sean Massa's mini-talk](https://www.youtube.com/watch?v=CcSKlsc_AhQ) on what it means to be a contributor. To sum up the talk, you can be a contributor in many ways. I want you to discover a path that meets your goals well!

Here are some suggestions to help you start:


<details>

<summary>Give feedback 💞</summary>

1. An open source project's value comes from people using the code and extending it to make greater things. Let me know how you use `@codemod-utils` in your codemod!

1. You can **create an issue** to:

    - Share how you used `@codemod-utils`
    - Share what you liked or didn't like about `@codemod-utils`

</details>


<details>

<summary>Help with marketing 📢</summary>

1. Platforms include:

    - Blog post
    - GitHub star
    - Meetup or conference talk
    - Social media
    - Word of mouth

</details>


<details>

<summary>Join this project 👩‍💻👨‍💻</summary>

1. Help me maintain the project! I have limited time and there is much that I don't know.

    - Cut releases
    - Research new ways to implement codemods
    - Respond to issues
    - Review pull requests

</details>


<details>

<summary>Make issues 📝</summary>

1. In addition to sharing feedback (described in `Give feedback`), you can create an issue to:

    - Ask for better documentation
    - Ask for new feature or refactor
    - Report bug
    - Report outdated dependency

1. When reporting a bug, please provide details to help me understand what's going on. If possible, please use the latest version of `@codemod-utils` and set up a public demo that I (and others) can check the code.

</details>


💡 Have ideas for contribution? Reach out to `@ijlee2` on [Discord](https://discord.com/invite/emberjs)!
