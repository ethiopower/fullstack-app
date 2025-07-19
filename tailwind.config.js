/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        heading: ['var(--font-poppins)'],
      },
      colors: {
        primary: {
          DEFAULT: '#0F9D58',
          light: '#3EAF7C',
          dark: '#0B8C4D',
        },
        secondary: {
          DEFAULT: '#F4B400',
          light: '#FFC933',
          dark: '#CC9600',
        },
        accent: {
          DEFAULT: '#DB4437',
          light: '#E57373',
          dark: '#B71C1C',
        },
      },
    },
  },
  plugins: [],
} 