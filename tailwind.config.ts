import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#ffffff",
        ink: "#2c2c2c",
        accent: "#dc3545",
        muted: "#858585",
        pitch: "#111111",
        borderDark: "#595959",
        glass: "rgba(4, 7, 13, 0.2)"
      },
      boxShadow: {
        badge:
          "0px 0.83px 1px rgba(207, 231, 255, 0.2) inset",
        card: "0 18px 45px rgba(0, 0, 0, 0.08)"
      },
      transitionTimingFunction: {
        framer: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    }
  },
  plugins: []
};

export default config;
