import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--bg) / <alpha-value>)",
        foreground: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-foreground": "rgb(var(--muted-fg) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-fg) / <alpha-value>)",
        },
        ink: "rgb(var(--ink) / <alpha-value>)",
      },
      fontFamily: {
        sans: [
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        serif: ["Charter", "Georgia", "serif"],
      },
      maxWidth: {
        article: "680px",
      },
      typography: () => ({
        DEFAULT: {
          css: {
            maxWidth: "680px",
            fontSize: "18px",
            lineHeight: "1.7",
            color: "rgb(var(--fg))",
            "--tw-prose-body": "rgb(var(--fg))",
            "--tw-prose-headings": "rgb(var(--fg))",
            "--tw-prose-links": "rgb(var(--primary))",
            "--tw-prose-bold": "rgb(var(--fg))",
            "--tw-prose-quotes": "rgb(var(--muted-fg))",
            "--tw-prose-code": "rgb(var(--fg))",
            "--tw-prose-bullets": "rgb(var(--muted-fg))",
            a: {
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            },
            p: {
              marginTop: "1.25em",
              marginBottom: "1.25em",
            },
          },
        },
        invert: {
          css: {
            "--tw-prose-body": "rgb(var(--fg))",
            "--tw-prose-headings": "rgb(var(--fg))",
            "--tw-prose-links": "rgb(var(--primary))",
          },
        },
      }),
    },
  },
  plugins: [typography],
};
export default config;
