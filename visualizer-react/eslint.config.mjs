import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'app',
  react: true,
  typescript: true,
  formatters: true,
  stylistic: {
    indent: 2,
    semi: false,
    quotes: 'single',
  },
}, {
  rules: {
    'ts/no-redeclare': 'off',
    'ts/consistent-type-definitions': ['error', 'type'],
    'no-console': ['error'],
    'antfu/no-top-level-await': ['off'],
    'node/prefer-global/process': ['off'],
    'node/no-process-env': ['error'],
    'perfectionist/sort-imports': ['error', {
      tsconfigRootDir: '.',
    }],
    'react/no-nested-component-definitions': ['off'],
    'ts/no-explicit-any': ['warn'],
    'unicorn/filename-case': ['off', {
      case: 'camelCase',
      ignore: ['README.md'],
    }],
  },
})
