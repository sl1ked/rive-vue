module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
    'plugin:storybook/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2021,
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  plugins: ['@typescript-eslint', 'prettier', 'vue'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'prefer-const': [
      'warn',
      {
        destructuring: 'all',
      },
    ],
    'no-var': 'error',
    eqeqeq: ['error', 'smart'],
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-vars': 'error',
    'vue/script-setup-uses-vars': 'error',
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'vue/no-unused-vars': 'error',
      },
    },
  ],
};
