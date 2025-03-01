module.exports = {
    parser: '@babel/eslint-parser', // 或者根据你的项目使用合适的 parser
    plugins: ['react', 'import'],
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:import/errors',
      'plugin:import/warnings'
    ],
    rules: {
      'import/no-unresolved': 'error',
      // 如果你希望在使用 JSX 时检测缺少 React 导入（仅适用于 React <17 的情况）：
      // 'react/react-in-jsx-scope': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    env: {
      browser: true,
      node: true,
      es6: true,
    },
  };
  