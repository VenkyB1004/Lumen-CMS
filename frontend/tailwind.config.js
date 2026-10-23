/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lumen: {
          bg: '#F4F8F5',
          surface: '#FFFFFF',
          input: '#EFF5F0',
          border: '#DCE8DF',
          primary: '#1D4936',
          'primary-dark': '#153A2A',
          'primary-light': '#35634D',
          accent: '#D97736',
          muted: '#66766B',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
