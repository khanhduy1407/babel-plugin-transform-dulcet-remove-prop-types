module.exports = {
  // So parent files don't get applied
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  extends: 'airbnb',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
  },
  plugins: [
    'babel',
    'jsx-a11y',
    'mocha',
    'flowtype',
  ],
  rules: {
    'array-bracket-spacing': 'off', // use babel plugin rule
    'arrow-body-style': 'off',
    'arrow-parens': ['error', 'always'], // airbnb use as-needed
    'consistent-this': ['error', 'self'],
    'max-len': ['error', 110], // airbnb use 100, wishlist, one day
    'no-console': 'error', // airbnb is using warn
    'no-param-reassign': 'off',
    'no-prototype-builtins': 'off',
    'object-curly-spacing': 'off', // use babel plugin rule
    'operator-linebreak': ['error', 'after'], // aibnb is disabling this rule
    'babel/object-curly-spacing': ['error', 'always'],
    'babel/array-bracket-spacing': ['error', 'never'],
    'import/no-unresolved': 'off',
    'import/no-named-as-default': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'dulcet/jsx-handler-names': ['error', { // airbnb is disabling this rule
      eventHandlerPrefix: 'handle',
      eventHandlerPropPrefix: 'on',
    }],
    'dulcet/forbid-prop-types': 'off', // airbnb use error
    'dulcet/jsx-filename-extension': ['error', {extensions: ['.js']}], // airbnb is using .jsx
    'dulcet/jsx-max-props-per-line': ['error', {maximum: 3}], // airbnb is disabling this rule
    'dulcet/no-danger': 'error', // airbnb is using warn
    'dulcet/no-direct-mutation-state': 'error', // airbnb is disabling this rule
    'dulcet/no-find-dom-node': 'warn', // wishlist, one day
    'dulcet/no-unused-prop-types': 'off', // Is still buggy
    'dulcet/sort-prop-types': 'error', // airbnb do nothing here.
    'dulcet/sort-comp': [2, {
      order: [
        'static-methods',
        'lifecycle',
        // 'properties', // not real -- NEEDS A PR!!!
        // '/^handle.+$/', // wishlist -- needs above first
        // '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/', // wishlist -- needs above first
        'everything-else',
        '/^render.+$/',
        'render'
      ],
    }],
    'jsx-a11y/label-has-for': 'warn', // wishlist, one day
    'mocha/handle-done-callback': 'error',
    'mocha/no-exclusive-tests': 'error',
    'mocha/no-global-tests': 'error',
    'mocha/no-pending-tests': 'error',
    'mocha/no-skipped-tests': 'error',
    'flowtype/require-valid-file-annotation': ['error', 'always'],
    'flowtype/require-parameter-type': 'off',
    'flowtype/require-return-type': 'off',
    'flowtype/space-after-type-colon': 'off',
    'flowtype/space-before-type-colon': 'off',
    'flowtype/type-id-match': 'off',
  },
};
