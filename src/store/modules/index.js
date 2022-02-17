import camelCase from 'lodash/camelCase';

const requireModule = require.context(
  // directory to perform the search + if webpack should search for subdirectories + regex to match fileName
  '.', false, /\.js$/
);

const modules = {};

// loop through the modules found by the require.context function
requireModule.keys().forEach((fileName) => {
  if (fileName === './index.js') return;

  const moduleConfig = requireModule(fileName); // return exported data
  // remove ./ from the beginning of the filename .js extension and
  const moduleName = camelCase(fileName.replace(/(\.\/|\.js)/g, ''));
  // check if the exported data is assigned under the default property by webpack
  // or if the data was coming from a named export, then use the whole object as is
  modules[moduleName] = moduleConfig.default || moduleConfig;
});

export default modules; // export the results (store files)

// This file is for automating the registration of modules for scalability