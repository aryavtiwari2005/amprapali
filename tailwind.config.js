/** @type {import('tailwindcss').Config} */
const { Roboto } = require('next/font/google');
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/app/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          800: '#5a3e36', // Example brown shade
        },
        btn: {
          800: "#f59e0b"
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        merriweather: ['var(--font-merriweather)', ...fontFamily.serif],
        dmsans: ['var(--font-dmsans)', 'sans-serif', ...fontFamily.serif],
        montserrat: ['var(--font-montserrat)', ...fontFamily.sans],
        playfair: ['var(--font-playfair)', ...fontFamily.serif],
        roboto: ['var(--font-roboto)', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
