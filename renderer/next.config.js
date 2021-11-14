const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

const config = withPlugins([[optimizedImages, {}]], { images: { disableStaticImages: true } });

module.exports = config;
