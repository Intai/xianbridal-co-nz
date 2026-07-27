var js = require('@eslint/js'),
  globals = require('globals'),
  react = require('eslint-plugin-react'),
  reactHooks = require('eslint-plugin-react-hooks'),
  stylistic = require('@stylistic/eslint-plugin')

module.exports = [
  {
    ignores: [
      'dist/**',
      'static/**',
    ],
  },
  js.configs.recommended,
  react.configs.flat.recommended,
  reactHooks.configs.flat.recommended,
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      '@stylistic': stylistic,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.commonjs,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // moved out of eslint core in v9. SwitchCase and the template literal
      // contents are spelled out because @stylistic defaults differ from the
      // core rule these replace, and would otherwise reformat existing code.
      '@stylistic/comma-dangle': ['warn', 'always-multiline'],
      '@stylistic/indent': ['error', 2, {
        // core defaulted to 0, @stylistic defaults to 1.
        SwitchCase: 0,
        // styled-components css, not javascript.
        ignoredNodes: ['TemplateLiteral *'],
      }],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/jsx-quotes': 'warn',
      '@stylistic/jsx-indent-props': ['warn', 2],
      'no-console': 'off',
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
      }],
      'react/prop-types': 'off',
      'react/forbid-component-props': 'off',
      'react/no-multi-comp': ['error', {
        ignoreStateless: true,
      }],
      // incompatible with the renderX() helpers called during render. the rule
      // cannot see through a plain function call, so it assumes any callback
      // closing over a ref escapes into render. revisit if those helpers ever
      // become components.
      'react-hooks/refs': 'off',
    },
  },
]
