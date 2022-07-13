// We need this file here for HMR to work and the original in renderer folder for build to work 🤷
const tailwindConfig = require('./packages/renderer/tailwind.config.js');

// eslint-disable-next-line no-undef
module.exports = {
  ...tailwindConfig,
  content: [
    './packages/renderer/index.html',
    './packages/renderer/src/**/*.{vue,ts}',
  ],
}
