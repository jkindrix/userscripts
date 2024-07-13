import globals from "globals";
import pluginJs from "@eslint/js";
import pluginPrettier from "eslint-plugin-prettier";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2021,
      sourceType: "module",
    },
    plugins: {
      js: pluginJs,
      prettier: pluginPrettier,
    },
    rules: {
      // ESLint recommended rules
      ...pluginJs.configs.recommended.rules,

      // Prettier plugin rules
      "prettier/prettier": "error",

      // Custom rules
      "no-unused-vars": "warn",
      "no-console": "off",
      "indent": ["error", 2],
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "eqeqeq": ["error", "always"],
      "curly": "error",
      "no-multi-spaces": "error",
      "comma-dangle": ["error", "always-multiline"],
      "no-trailing-spaces": "error",
      "space-before-function-paren": ["error", "never"],
      "keyword-spacing": ["error", { "before": true, "after": true }],
      "space-infix-ops": "error",
      "space-unary-ops": "error",
      "arrow-spacing": "error",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "error",
      "no-duplicate-imports": "error",
      "object-shorthand": ["error", "always"],
      "array-callback-return": "warn",
      "consistent-return": "warn",
    },
  },
];
