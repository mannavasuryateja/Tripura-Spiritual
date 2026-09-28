/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spiritual-plum': '#3B234A',
        'spiritual-terracotta': '#8B5E34',
        'spiritual-gold': '#D1A559',
        'spiritual-sand': '#E6E0D2',
        'spiritual-cream': '#F8F5EE',
        'spiritual-dark': '#2C2421',
        spiritual: {
          50: '#fffdfa',
          100: '#fdf8ef',
          200: '#f9eed7',
          300: '#f3d9aa',
          400: '#eab875',
          500: '#e19543',
          600: '#d1762c',
          700: '#ae5523',
          800: '#8c4222',
          900: '#723720',
          plum: '#3B234A',
          terracotta: '#8B5E34',
          gold: '#D1A559',
          sand: '#E6E0D2',
          cream: '#F8F5EE',
          dark: '#2C2421',
          warmGold: '#D1A559',
          parchment: '#F8F5EE',
          charcoal: '#2C2421',
          saffron: '#ea580c',
          amber: '#f59e0b',
          lightCream: '#fffdf9',
          deepBg: '#181411',
          lotusPink: '#f472b6',
          sage: '#ecfdf5',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Outfit', 'Inter', 'sans-serif'],
        telugu: ['Noto Sans Telugu', 'Gidugu', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'spiritual': '0 10px 30px -10px rgba(180, 83, 9, 0.15)',
        'spiritual-lg': '0 20px 40px -15px rgba(180, 83, 9, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'ken-burns': 'kenburns 20s ease-in-out infinite alternate',
        'kenburns': 'kenburns 20s ease-in-out infinite alternate',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'slideDown': 'slideDown 0.3s ease-out forwards',
        'fadeIn': 'fadeIn 0.35s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(217, 119, 6, 0.3))' },
          '100%': { opacity: '1', filter: 'drop-shadow(0 0 30px rgba(245, 158, 11, 0.6))' },
        },
        kenburns: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08) translate(-1%, -1%)' },
          '100%': { transform: 'scale(1)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
