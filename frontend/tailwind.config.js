// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.css",
    // CRITICAL: Ensure this line correctly points to your source files
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        'primary-orange': '#FF8C00', 
        'primary-dark': '#333333',
        'secondary-light': '#F8F8F8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}