const { resolveGitFolder } = require("./file-util-git-history");
const { resolve } = require("path");

test("find git folder for current file", async () => {
  expect.assertions(1);
  const actual = await resolveGitFolder(__filename);
  const expected = resolve(__dirname, ".git");
  expect(actual).toBe(expected);
});

test("relative path should throw", async () => {
  await expect(resolveGitFolder(".")).rejects.toThrow();
});

test("path with not fit parent should throw", async () => {
  await expect(resolveGitFolder(resolve(__dirname, ".."))).rejects.toThrow();
});
