import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    languageOptions: { globals: globals.browser },
    parser: "@babel/eslint-parser", // Utilise le parser Babel
    
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];

