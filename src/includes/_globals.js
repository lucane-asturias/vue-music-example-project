import _ from 'lodash';

export default { // export vue plugin under default namespace
  install(app) {
    const baseComponents = require.context(
      // directory where Webpack should begin its search + not search in subdirectory + file name 
      '../components/base/', false, /[A-Za-z0-9-_,\s]+\.vue$/i
    );
    // keys return an array of files based on the arguments passed into the required.context function
    baseComponents.keys().forEach((fileName) => {
      const componentConfig = baseComponents(fileName); // filename for Webpack to import the component
      // format the name of the component in PascalCase using lodash
      const componentName = _.upperFirst(
        // replace ./ inside the string to '' and replace .vue to '' (removing from it)
        _.camelCase(fileName.replace(/^\.\//, '').replace(/\.\w+$/, ''))
      );
      // prefixing the component and checking if the default property holds the config options
      app.component(`Base${componentName}`, componentConfig.default || componentConfig)
    });
  },
};

// This file will automatically register components defined in the /components/base directory