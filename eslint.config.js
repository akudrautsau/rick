// @ts-check

import globals from 'globals';
import eslint from '@eslint/js';
import ts_eslint from 'typescript-eslint';
import plugin_prettier_recommended from 'eslint-plugin-prettier/recommended';
import plugin_react_recommended from 'eslint-plugin-react/configs/recommended.js';
import plugin_react_jsx_runtime from 'eslint-plugin-react/configs/jsx-runtime.js';

import { fixupPluginRules } from '@eslint/compat';
import plugin_react_hooks from 'eslint-plugin-react-hooks';
import plugin_jsx_a11y from 'eslint-plugin-jsx-a11y';

export default ts_eslint.config(
  eslint.configs.recommended,
  ...ts_eslint.configs.recommended,
  ...ts_eslint.configs.stylistic,
  plugin_prettier_recommended,

  plugin_react_recommended,
  plugin_react_jsx_runtime,

  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    settings: {
      react: { version: 'detect' },
      componentWrapperFunctions: ['observer', 'styled'],
    },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    plugins: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      'react-hooks': fixupPluginRules(plugin_react_hooks),
      'jsx-a11y': plugin_jsx_a11y,
    },
    rules: {
      ...plugin_react_hooks.configs.recommended.rules,
      ...plugin_jsx_a11y.flatConfigs.recommended.rules,
    },
  },
  {
    rules: {
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'always',
          singleQuote: true,
          trailingComma: 'es5',
          printWidth: 120,
          endOfLine: 'auto',

          jsxSingleQuote: true,
          bracketSameLine: false,
        },
      ],
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-empty-function': 'off',

      'react-hooks/exhaustive-deps': 'off',
    },
  }
);
