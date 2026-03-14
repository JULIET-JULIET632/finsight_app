/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3A361',
      },
      borderRadius: {
        'custom': '10px',
        'card': '20px',
      }
    },
  },
  plugins: [],
}