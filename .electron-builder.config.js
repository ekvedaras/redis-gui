if (process.env.VITE_APP_VERSION === undefined) {
  process.env.VITE_APP_VERSION = require('./package.json').version;
}

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  directories: {
    output: 'dist',
    buildResources: 'buildResources',
  },
  files: [
    'packages/**/dist/**',
  ],
  snap: {
    // The Snap Store upload is a separate best-effort step in the release workflow, so an
    // expired store token cannot stop the GitHub artifacts from publishing.
    publish: ['github'],
  },
  extraMetadata: {
    version: process.env.VITE_APP_VERSION,
  },
};

module.exports = config;
