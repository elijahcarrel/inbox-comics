module.exports = {
    extends: ["airbnb-typescript-prettier"],
    rules: {
        "import/prefer-default-export": "off",
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
        "import/no-extraneous-dependencies": [
            "error",
            {
                "devDependencies": [
                    "src/api-test/**/*.ts",
                ]
            }
        ]
    },
    root: true,
};
