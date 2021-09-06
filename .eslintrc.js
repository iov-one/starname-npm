module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint", "simple-import-sort", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {
    "prettier/prettier": ["error"],
    "no-empty": "off",
    "no-console": [
      "warn",
      {
        allow: ["error", "info", "warn"],
      },
    ],
    "no-param-reassign": "warn",
    "prefer-const": "warn",
    "sort-imports": "off", // we use the simple-import-sort plugin instead
    "comma-dangle": ["error", "always-multiline"],
    "spaced-comment": [
      "warn",
      "always",
      { line: { markers: ["/ <reference"] } },
    ],
    "simple-import-sort/imports": "warn",
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowExpressions: true,
      },
    ],
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "warn",
    "@typescript-eslint/no-unused-vars": 0,
  },
  overrides: [
    {
      files: "**/*.js",
      rules: {
        "@typescript-eslint/no-var-requires": 0,
      },
    },
  ],
};
