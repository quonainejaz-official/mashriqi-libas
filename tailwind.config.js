/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f0',
          100: '#fbeed8',
          200: '#f6d9a8',
          300: '#f0bf6e',
          400: '#e8a043',
          500: '#e08a27',
          600: '#c96d1c',
          700: '#a6521a',
          800: '#85411c',
          900: '#6c361a',
        },
        gold: {
          400: '#f0bf6e',
          500: '#d4a017',
          600: '#b8860b',
        },
        dark: {
          900: '#1a0f0a',
          800: '#2d1f15',
          700: '#3d2a1c',
        },
        cream: {
          50: '#fefdf8',
          100: '#fdf8ed',
          200: '#f9eecc',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        urdu: ['Noto Nastaliq Urdu', 'serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/hero-pattern.svg')",
        'gold-gradient': 'linear-gradient(135deg, #e08a27 0%, #d4a017 50%, #b8860b 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1a0f0a 0%, #2d1f15 100%)',
      },
      boxShadow: {
        'gold': '0 4px 20px rgba(212, 160, 23, 0.3)',
        'card': '0 2px 20px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
};
