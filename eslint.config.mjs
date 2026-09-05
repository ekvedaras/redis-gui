import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

export default tseslint.config(
  {
    ignores: [
      'types/env.d.ts',
      '**/dist/**',
      'dist_electron/**',
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  pluginVue.configs['flat/essential'],
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: globals.node,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/ban-ts-comment': 'off',
      'comma-dangle': ['warn', 'always-multiline'],
      quotes: ['warn', 'single'],
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    files: ['packages/renderer/**'],
    languageOptions: {
      globals: globals.browser,
    },
  },
)
