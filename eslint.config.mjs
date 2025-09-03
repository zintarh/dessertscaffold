import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // disable for now
      "@typescript-eslint/no-unused-vars": "warn", // change to warning
      "@typescript-eslint/no-empty-object-type": "off", // disable for now
      "react/no-unescaped-entities": "warn", // change to warning
      "@next/next/no-img-element": "warn", // change to warning
      "react-hooks/exhaustive-deps": "warn", // change to warning
      "jsx-a11y/alt-text": "warn", // change to warning
      "react/jsx-no-undef": "warn", // change to warning
      "prefer-const": "warn", // change to warning
    }
  }
];

export default eslintConfig;
