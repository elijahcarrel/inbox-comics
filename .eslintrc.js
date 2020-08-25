module.exports = {
  extends: "airbnb-typescript-prettier",
  rules: {
    "import/prefer-default-export": 0,
    "react/jsx-props-no-spreading": 0,
    "react/require-default-props": 0,
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
  },
};
