// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Import the config from your file
import tailwindConfig from './tailwind.config.js'; // Assuming you kept the file name

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    // Pass the config object here
    tailwindcss(tailwindConfig) 
  ],
})