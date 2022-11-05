module.exports = {
  extends: ["airbnb-typescript-prettier", "plugin:@next/next/recommended"],
  rules: {
    "import/prefer-default-export": "off",
    "react/jsx-props-no-spreading": "off",
    "react/require-default-props": "off",
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "import/extensions": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
  },
};
