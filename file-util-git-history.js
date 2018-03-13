const { access } = require("fs");
const { isAbsolute, parse, resolve } = require("path");
const { promisify } = require("util");
const assert = require("assert");

const accessAsync = promisify(access);

async function resolveGitFolder(path) {
  assert(isAbsolute(path), "path must be absolute");

  // search has reached the file system root
  // and the git folder has not been found
  const { root, dir } = parse(path);
  assert(root !== dir, "git folder not found");

  try {
    // check the current folder
    const gitPath = resolve(path, ".git");
    await accessAsync(gitPath);

    // if no error has been thrown folder has been found
    return gitPath;
  } catch (err) {
    // search parent folder
    return resolveGitFolder(resolve(path, ".."));
  }
}

module.exports = { resolveGitFolder };
