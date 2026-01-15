/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'nexum-bg': '#1a1a2e',
        'nexum-canvas': '#16213e',
        'nexum-border': '#0f3460',
        'nexum-accent': '#e94560',
      },
    },
  },
  plugins: [],
}

