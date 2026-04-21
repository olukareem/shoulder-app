// Flat-config for ESLint 9 + Next 16.
// Next dropped `next lint` in v16; configs are now imported directly.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [".next/**", "node_modules/**", "supabase/.temp/**"],
  },
];

export default config;
