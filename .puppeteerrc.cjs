const { join } = require('path')

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer to project directory
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),

  // Download Chrome (default `skipDownload: false`)
  chrome: {
    skipDownload: false,
  },
}
