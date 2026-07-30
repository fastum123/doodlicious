import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: "#fff0f6",
          100: "#ffdcec",
          200: "#ffb8d9",
          300: "#ff8ec0",
          400: "#fb5fa3",
          500: "#f0328a",
          600: "#d61b71",
          700: "#b0135c",
          800: "#8f124d",
          900: "#771342"
        }
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
export default config;
