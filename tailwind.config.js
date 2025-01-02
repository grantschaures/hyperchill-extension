/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        myFontPlain: ['myFontPlain', 'sans-serif'],
        myFontBold: ['myFontBold', 'sans-serif'],
        myFontLight: ['myFontLight', 'sans-serif'],
        settingsHeaderFont: ['settingsHeaderFont', 'sans-serif'],
        settingsHeaderFontBold: ['settingsHeaderFontBold', 'sans-serif'],
      },
    },
  },
  plugins: [],
}