module.exports = {
  root: true,
  extends: [
    // Airbnb style guide 적용
    'airbnb-base',
    'airbnb-typescript/base',
    // TypeScript ESLint recommanded style 적용
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": ["error", {"functions": false, "classes": false, "variables": false}],
        'no-shadow': 'off',
        'no-undef': 'off',
      },
    },
  ],
  settings: {
    "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  }
};
