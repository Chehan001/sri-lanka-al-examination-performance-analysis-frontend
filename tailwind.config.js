/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2f2',
          100: '#fbe5e6',
          200: '#f7cfd2',
          300: '#efacb1',
          400: '#e17d87',
          500: '#ce5260',
          600: '#b43343',
          700: '#972432',
          800: '#7e202b',
          900: '#691e26',
          950: '#3b0c11',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
