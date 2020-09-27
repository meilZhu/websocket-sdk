/*
 * @file: 
 * @Date: 2020-09-07 18:21:26
 * @author: manyao.zhu
 */
module.exports = {
  "root": true,
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 7,
    "sourceType": "module"
  },
  "env": {
    "node": true
  },
  "plugins": [
    "html",
    "promise"
  ],
  "extends": [
    'airbnb-base/legacy'
  ],
  "rules": {
    "max-len": [2, { "code": 200, "ignoreComments": true }],
    "newline-per-chained-call": 0,
    "no-param-reassign": [2, { "props": false }],
    "no-new": 0,
    "no-console": 0,
    "no-plusplus": 0,
    "no-loop-func": 1,
    "linebreak-style": 0,
    "semi": ["error", "always"],
    "indent": [2, 4],
    "eol-last": ["error", "never"],
    "class-methods-use-this": "off",
    "space-before-function-paren": ["error", "never"],
    "no-use-before-define": ["error", { "functions": false, "classes": false }],
    "no-unneeded-ternary": 0
  },
  "globals": {
    "Promise": true,
    "sessionStorage": true
  }
};
