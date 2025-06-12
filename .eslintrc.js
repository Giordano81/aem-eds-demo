module.exports = {
  root: true,
  extends: [
    "airbnb-base",
    "plugin:json/recommended",
    "plugin:xwalk/recommended",
  ],
  env: {
    browser: true,
  },
  parser: "@babel/eslint-parser",
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: "module",
    requireConfigFile: false,
  },
  rules: {
    "import/extensions": ["error", { js: "always" }],
    "linebreak-style": ["error", "unix"],
    "no-param-reassign": [2, { props: false }],
    quotes: "off", // accetta sia doppie che singole virgolette
    "no-alert": "off", // consenti alert
    "prefer-template": "off", // consenti concatenazione stringhe
  },
};
