const {
  gitHistory,
  resolveGitFolder,
  readHistory
} = require("./file-util-git-history");
const { resolve } = require("path");

test("find git folder for current file", async () => {
  const actualGitFolder = resolveGitFolder(__filename);
  const expectedGitFolder = resolve(__dirname, ".git");
  await expect(actualGitFolder).resolves.toBe(expectedGitFolder);
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
  const history = readHistory(__filename, resolve(__dirname, ".git"));
  await expect(history).resolves.not.toHaveLength(0);
});

test("should have first commit", async () => {
  const history = await readHistory(__filename, resolve(__dirname, ".git"));
  const firstSha = history[0].commit.sha();
  // commit where this spec was added
  await expect(firstSha).toBe("038c2a637df844bdd547e68686a7fc764e6aae31");
});

test("missing file should fail", async () => {
  const history = readHistory(__filename + ".dne", resolve(__dirname, ".git"));
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
