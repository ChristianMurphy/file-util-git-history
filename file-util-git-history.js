const { access } = require("fs");
const { Repository, Revwalk } = require("nodegit");
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

async function readHistory(filePath, gitPath) {
  // ensure filepath and gitpath exist
  await accessAsync(filePath);
  await accessAsync(gitPath);

  // open repository to HEAD commit
  const repo = await Repository.open(gitPath);
  const walker = repo.createRevWalk();
  walker.pushHead();
  walker.sorting(Revwalk.SORT.Time);

  // find commits that are related to file
  // NOTE: this may need to be made recursive to pull extremely long histories
  const history = await walker.fileHistoryWalk(
    "file-util-git-history.js",
    100000
  );

  // cleanup references to native code
  walker.free();
  repo.free();

  return history;
}

async function gitHistory(filePath, options = {}) {
  const gitPath = options.gitPath ? gitPath : await resolveGitFolder(filePath);
  return readHistory(filePath, gitPath);
}

module.exports = { gitHistory, readHistory, resolveGitFolder };
