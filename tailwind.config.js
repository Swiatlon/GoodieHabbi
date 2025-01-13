/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1987EE",
        secondary: "#4b465d",
        accent: "#47B64E",
        success: "#47B64E",
      },
      fontFamily: {
        rubik: ["Rubik_400Regular", "sans-serif"],
      },
      ringWidth: {
        DEFAULT: '2px',
      },
      ringColor: {
        primary: '#1987EE',
      },
    },
  },
  plugins: [],
};
