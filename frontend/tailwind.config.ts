import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          500: '#6366f1',
          700: '#4338ca'
        }
      }
    }
  },
  darkMode: 'class',
  plugins: [],
} satisfies Config;
