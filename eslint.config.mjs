import antfu from "@antfu/eslint-config";
import eslintConfigTurbo from "eslint-config-turbo";
import eslintConfigDrizzle from "eslint-plugin-drizzle";

export default antfu(
  {
    lessOpinionated: true,
    plugins: ({ eslintConfigTurbo, eslintConfigDrizzle }),
    type: "app",
    typescript: true,
    formatters: true,
    stylistic: {
      indent: 2,
      semi: true,
      quotes: "double",
    },
    ignores: ["**/migrations/*", "**/*.yml", "**/*.yaml", "**/*.md"],
  },
  {
    rules: {
      "no-console": ["warn"],
      "antfu/no-top-level-await": ["off"],
      "node/prefer-global/process": ["off"],
      "node/no-process-env": ["error"],
      "perfectionist/sort-imports": [
        "off",
        {
          internalPattern: ["@/**"],
        },
      ],
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
          ignore: ["README.md"],
        },
      ],
    },
  },
);
