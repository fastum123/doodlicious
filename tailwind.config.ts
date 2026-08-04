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
        },
        cream: {
          50: "#fffaf5",
          100: "#fef3e7"
        },
        plum: {
          600: "#7c2d5c",
          900: "#3a1230"
        }
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "-apple-system",
          "Segoe UI",
          "system-ui",
          "sans-serif"
        ],
        display: [
          "ui-rounded",
          "-apple-system",
          "Segoe UI",
          "Verdana",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ]
      },
      boxShadow: {
        glow: "0 20px 60px -15px rgba(240, 50, 138, 0.35)",
        card: "0 10px 30px -12px rgba(119, 19, 66, 0.18)"
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(circle at 20% 20%, #ffe3f0 0%, #fff5fa 45%, #fffaf5 100%)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
export default config;
