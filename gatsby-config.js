const path = require('path');
const ROOT_PATH = path.resolve(__dirname, './src');

module.exports = {
  siteMetadata: {
    title: 'Terry Chen | Software Engineer',
    description: '',
    author: 'Terry Chen',
  },
  plugins: [
    'gatsby-plugin-sass',
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${ROOT_PATH}/data/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${ROOT_PATH}/images`,
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
  ],
}
