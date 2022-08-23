# NPM Audit Comment GitHub Action

This action audits the `package.json` of a project and makes a comment on the associated PR to highlight any nasty dependency issues that may have arisen recently. It is intended to provide visibility on the open audit issues rather than mandate an update/fix, leaving enforcing these issues to the PR approver/raiser. It runs on a `pull request` trigger and executes `npm audit` on the specified `package.json`.

## Inputs

### `package_json_path`

**Required** Folder within which the package.json lives (relative to project root). Default `"./"`.

### `github_token`

**Required** GitHub access token, needed to make a comment on the PR.

## Example usage

In `.github/workflows/npm-audit.yml` paste the following snippet.

```yml
name: "NPM Audit Report - PR"

on:
  pull_request:

jobs:
  worker:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v1

      - name: NPM Audit Comment
        uses: wx-jayesh/actions-npm-audit-comment@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```
