const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "header-max-length": [2, "always", 100],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "chore",
        "docs",
        "refactor",
        "style",
        "test",
        "perf",
        "ci",
        "build",
        "revert",
      ],
    ],
  },
};

export default config;
