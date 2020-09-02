# file-util-git-history

[![NPM Version](https://img.shields.io/npm/v/file-util-git-history.svg)](https://www.npmjs.com/package/file-util-git-history)
[![ Build Status](https://travis-ci.org/ChristianMurphy/file-util-git-history.svg?branch=main)](https://travis-ci.org/ChristianMurphy/file-util-git-history)

## Installation

```shell
# npm installation
npm install file-util-git-history

# yarn installation
yarn add file-util-git-history
```

## Usage

```javascript
const { gitHistory } = require("file-util-git-history");

// get history for current file
gitHistory(__filename)
  // get the SHA hash for each commit
  .then((history) => history.map(({ commit }) => commit.sha()))
  // print out the SHAs
  .then(console.log);
```

git history can accept two parameters:

- `{string} filePath` path to file
- `{Object} [options]` optional configuration
  - `{string} [gitPath]` - optional predetermined git folder to get history from

will return a promise that resolves to a list of `{status, commit}`.
Where `status` is a git status code, and `commit` is a [nodegit `Commit` class](http://www.nodegit.org/api/commit/).
