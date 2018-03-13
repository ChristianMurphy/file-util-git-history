const { resolveGitFolder } = require("./file-util-git-history");
const { resolve } = require("path");

test("find git folder for current file", async () => {
  const actual = resolveGitFolder(__filename);
  const expected = resolve(__dirname, ".git");
  await expect(actual).resolves.toBe(expected);
});

test("relative path should throw", async () => {
  await expect(resolveGitFolder(".")).rejects.toThrow();
});

test("path with not fit parent should throw", async () => {
  await expect(resolveGitFolder(resolve(__dirname, ".."))).rejects.toThrow();
});
