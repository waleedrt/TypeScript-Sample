module.exports = {
  parser: 'babel-eslint',
  env: {
    jest: true,
    'react-native/react-native': true
  },
  plugins: ['react', 'react-native'],
  rules: {
    'react/forbid-prop-types': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-max-props-per-line': [1, { when: 'multiline' }]
  }
};
