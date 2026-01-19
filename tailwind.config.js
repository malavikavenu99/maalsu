
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./constants.tsx",
  ],
  theme: {
    extend: {
      colors: {
        ieee: {
          blue: '#00629B',
          dark: '#004165',
          light: '#00B5E2',
        }
      }
    },
  },
  plugins: [],
}
