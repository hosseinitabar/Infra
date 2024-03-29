const path = require(`path`);
const aliases = {
  '@Form': 'src/Components/Form/Form',
  '@List': 'src/Components/List/List'
};

const resolvedAliases = Object.fromEntries(
  Object.entries(aliases).map(([key, value]) => [key, path.resolve(__dirname, value)]),
);

module.exports = {
    style: {
      postcss: {
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    },
    webpack: {
      alias: resolvedAliases,
    },
  }