//@ts-check

import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    files: ['**/*.{js,ts}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
    ignores: ['**/dist/**'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      eslintConfigPrettier,
    ],
  },
])
