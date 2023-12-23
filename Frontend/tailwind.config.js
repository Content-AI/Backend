/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
      sans: [
        "Inter",
        "ProximaNova",
        "-apple-system",
        "Segoe UI",
        "Roboto",
        "Oxygen",
        "Ubuntu",
        "Cantarell",
        "Fira Sans",
        "Droid Sans",
        "Helvetica Neue",
        "Helvetica",
        "Arial",
        "sans-serif",
      ],
      monospace: ["monospace"],
      helv: ["Helvetica Bold", "Arial", "sans-serif"],
    },
    extend: {
      colors: {
        blue: {
          DEFAULT: "#1D43FF",
          700: "#2196F3",
          800: "#F0F7FE",
          900: "#FAFBFD",
        },
        green: {
          DEFAULT: "#23C16B",
        },
        text: {
          DEFAULT: "#414357",
          black: "#36464E",
        },
        gray: {
          lightbg: "#F7FAFC",
          500: "#85A0AD",
        },
        border: {
          DEFAULT: "#CFD0D5",
        },
      },
      boxShadow: {
        custom: "0 4px 4px rgba(0,0,0,.25)",
        customv2: "0 0 15px rgba(0,0,0,.15)",
      },
    },
  },
  plugins: [
  ],
  darkMode:"class",
};
