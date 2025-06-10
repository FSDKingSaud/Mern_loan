module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  // env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
     "plugin:emotion/recommended"
  ],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2", "jsx-runtime": "automatic" } },
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": "warn",
    "react/no-unknown-property": ["error", { ignore: ["css"] }],
  },
};
