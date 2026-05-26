import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#E53935",
          50: "#FEF2F2",
          100: "#FEE2E2",
          600: "#E53935",
          700: "#C62828",
        },
        cat: {
          organize: "#FF6D00",
          convert: "#43A047",
          optimize: "#00897B",
          edit: "#1E88E5",
          security: "#7B1FA2",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
