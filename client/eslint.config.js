import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
export default [
  { ignores: ['dist'] },
  js.configs.recommended,
  { files: ['src/**/*.{js,jsx}'], languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } }, globals: { window: 'readonly', document: 'readonly', localStorage: 'readonly' } }, plugins: { 'react-hooks': reactHooks }, rules: { 'no-unused-vars': 'off', 'no-empty': 'off', 'react-hooks/exhaustive-deps': 'warn' } }
];
