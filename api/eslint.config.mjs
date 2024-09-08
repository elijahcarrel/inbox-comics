import _import from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import { fixupPluginRules } from "@eslint/compat";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends(
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
), {
    plugins: {
        import: fixupPluginRules(_import),
        prettier,
    },

    rules: {
        "prettier/prettier": "error",
        "import/prefer-default-export": "off",
        "no-use-before-define": "off",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-use-before-define": ["error"],
        "import/extensions": "off",
        "no-unused-vars": "off",

        "@typescript-eslint/no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
        }],

        "import/no-extraneous-dependencies": ["error", {
            devDependencies: ["src/api-test/**/*.ts"],
        }],
    },
}];