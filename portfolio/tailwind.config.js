/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F5F3EE',
        bgAlt: '#EEEAE3',
        ink: '#0E0E0E',
        muted: '#6D6D6D',
        subtle: '#9E9E9E',
        line: '#EAEAEA',
        accent: '#E27500',
        accentDark: '#C96700',
        navy: '#0F376E',
      },
      fontFamily: {
        display: ['"Clash Display"', 'system-ui', 'sans-serif'],
        sans: ['"General Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xs: '8px',
        sm: '12px',
        md: '20px',
        lg: '30px',
      },
      maxWidth: {
        container: '1440px',
      },
      screens: {
        xs: '375px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'slow-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'slow-spin': 'slow-spin 20s linear infinite',
      },
    },
  },
  plugins: [],
}

