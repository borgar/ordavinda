import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const compat = new FlatCompat({
  baseDirectory: path.dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  jsdoc.configs['flat/recommended'],
  ...compat.extends('@borgar/eslint-config'),
  {
    languageOptions: {
      globals: {
        process: null,
        require: null,
        Promise: null,
        console: null,
        module: null,
        Headers: null,
        fetch: null,
        AbortSignal: null,
        BodyInit: null,
      },
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  }
];
