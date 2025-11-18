module.exports = {
  root: true,
  extends: ['@react-native'],
  parser: '@babel/eslint-parser',
  rules: {
    'prettier/prettier': 0,
    'no-unused-vars': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
};

