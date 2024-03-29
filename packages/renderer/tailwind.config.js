// eslint-disable-next-line no-undef
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,ts}',
  ],
  safelist: [
    'c-toast',
    'c-toast--default',
    'c-toast--success',
    'c-toast--info',
    'c-toast--error',
    'c-toast--warning',
  ],
  theme: {
    extend: {
      gridTemplateRows: {
        'layout': '50px 1fr',
      },
      colors: {
        'white-10p': 'rgba(255, 255, 255, 0.1)',
        'white-50p': 'rgba(255, 255, 255, 0.5)',
        'white-80p': 'rgba(255, 255, 255, 0.8)',
        'black-10p': 'rgba(0, 0, 0, 0.1)',
        'black-50p': 'rgba(0, 0, 0, 0.5)',
        'black-80p': 'rgba(0, 0, 0, 0.8)',
        'redis': {
          default: '#D92D20',
          '100': '#F8D1CE',
          '200': '#F1A7A2',
          '300': '#EA7D75',
          '400': '#E45349',
          '500': '#D92D20',
          '600': '#AD241A',
          '700': '#811B13',
          '800': '#54110D',
          '900': '#280806',
        },
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
        'jungle-green': {
          default: '#28C347',
          '100': '#C4F3CD',
          '200': '#99EAAA',
          '300': '#6FE286',
          '400': '#45D962',
          '500': '#28C347',
          '600': '#1F9837',
          '700': '#176E28',
          '800': '#0E4419',
          '900': '#051909',
        },
        'picton-blue': {
          default: '#349BEF',
          '100': '#F1F8FE',
          '200': '#C2E1FA',
          '300': '#92C9F6',
          '400': '#63B2F2',
          '500': '#349BEF',
          '600': '#1282DE',
          '700': '#0E66AF',
          '800': '#0A4B7F',
          '900': '#072F50',
        },
      },
      minHeight: {
        '16': '4rem',
      },
      margin: {
        '1-5': '0.35rem',
        '18': '4.5rem',
      },
    },
  },
  plugins: [],
}
