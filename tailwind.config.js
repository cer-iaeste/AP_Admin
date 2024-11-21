/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add this line to purge unused CSS
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
