/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'forest-dark': '#0F2E2A',
        'forest-mid': '#183F3A',
        'forest-light': '#1E4D47',
        gold: '#D6B97B',
        'gold-light': '#E8D4A8',
        'gold-pale': '#F5EDDA',
        cream: '#F3EFE6',
        'cream-dark': '#EAE4D8',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        ticker: 'ticker 24s linear infinite',
        'pulse-ring': 'pulse-ring 1.6s ease-out infinite',
      },
    },
  },
  plugins: [],
};
