module.exports = {
  "root": true,
  "parser": "@typescript-eslint/parser",
  "env": {
    "browser": true,
    "node": true
  },
  "plugins": [
    "svelte3",
    "@typescript-eslint"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "overrides": [
    {
      "files": ["*.svelte"],
      "processor": "svelte3/svelte3"
    }
  ],
  "rules": {
    "semi": "error",
    "no-mixed-spaces-and-tabs": "error",
    "@typescript-eslint/no-inferrable-types": "off",
    "no-irregular-whitespace": "error",
    "no-tabs": "error",
    "indent": ["error", 2],
    "max-len": ["error", {
      "code": 100,
      "ignoreUrls": true,
      "ignoreRegExpLiterals": true

    }],
    "eqeqeq": ["error", "always"],
    "no-multi-spaces": "error",
    "space-infix-ops": "error",
    "space-unary-ops": [
      "error", {
        "words": true,
        "nonwords": false
      }
    ]
  },
  "settings": {
    "svelte3/typescript": true,
    "svelte3/ignore-styles": () => true
  }
};
