module.exports = {
  purge: [],
  theme: {
    extend: {
      gridTemplateRows: {
        'layout': '50px 1fr',
      },
      colors: {
        'white-10p': 'rgba(255, 255, 255, 0.1)',
        'redis': '#da2c21',
        'redis-gray': {
          50: '#F6F6F6',
          100: '#ECECEC',
          200: '#D0D0D0',
          300: '#B3B3B3',
          400: '#7B7B7B',
          500: '#424242',
          600: '#3B3B3B',
          700: '#282828',
          800: '#1E1E1E',
          900: '#141414',
        },
      }
    },
  },
  variants: {},
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true
  }
}
