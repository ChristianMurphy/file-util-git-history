const {
  gitHistory,
  resolveGitFolder,
  readHistory
} = require("./file-util-git-history");
const { resolve } = require("path");

test("find git folder for current file", async () => {
  const gitFolder = resolveGitFolder(__filename);
  await expect(gitFolder).resolves.toBe(__dirname);
});

test("relative path should throw", async () => {
  const gitFolder = resolveGitFolder(".");
  await expect(gitFolder).rejects.toThrow();
});

test("path with not git parent should throw", async () => {
  const gitFolder = resolveGitFolder(resolve(__dirname, ".."));
  await expect(gitFolder).rejects.toThrow();
});

test("should read commits", async () => {
  const history = readHistory(__filename, __dirname);
  await expect(history).resolves.not.toHaveLength(0);
});

test("should have first commit", async () => {
  const history = await readHistory(__filename, __dirname);
  const initialCommit = history[history.length - 1].commit.sha();
  // commit where this spec was added
  expect(initialCommit).toBe("a31293d6ff81be7e8f54181ff592a6efd91500fe");
});

test("missing file should fail", async () => {
  const history = readHistory(__filename + ".dne", __dirname);
  await expect(history).rejects.toThrow();
});

test("missing git folder should fail", async () => {
  const history = readHistory(__filename, resolve(__dirname, ".."));
  await expect(history).rejects.toThrow();
});

test("should read commits from abstraction", async () => {
  const history = gitHistory(__filename);
  await expect(history).resolves.not.toHaveLength(0);
});
