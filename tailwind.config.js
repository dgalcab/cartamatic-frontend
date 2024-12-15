// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#33475c', // Azul
        secondary: '#d27930', // Naranja
      },
    },
  },
  plugins: [],
}
