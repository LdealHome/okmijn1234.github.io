module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    browser: true,
    commonjs: true,
    worker: true,
    amd: true,
    shelljs: true
  },
  globals: {
    Vue: false,
    $_: false
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    'vue'
  ],
  extends: [
    'plugin:vue/strongly-recommended',
    '@vue/standard'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-trailing-spaces': 'off',
    'vue/script-indent': ['error', 2, { 'baseIndent': 1 }]
  },
  overrides: [
    {
      'files': ['*.vue'],
      'rules': {
        'indent': 'off'
      }
    }
  ]
}
