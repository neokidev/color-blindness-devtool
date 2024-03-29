/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@color-blindness-devtool/eslint-config/base.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
}
