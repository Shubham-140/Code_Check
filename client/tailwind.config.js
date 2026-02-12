/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.html",
    "./js/**/*.js",
    "./pages/**/*.html"
    // Add specific paths, avoid node_modules
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}