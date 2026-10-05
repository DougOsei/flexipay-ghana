/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ghana: {
          gold: '#EAB308',
          darkgold: '#CA8A04',
          green: '#059669',
          darkgreen: '#064E3B',
          red: '#DC2626',
          dark: '#0F172A',
          card: '#1E293B'
        },
        momo: {
          mtn: '#FFCC00',
          telecel: '#E60000',
          at: '#005EB8'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
