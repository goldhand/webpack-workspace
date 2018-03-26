const fs = require('fs');
const glob = require('glob');
const path = require('path');
const webpackMerge = require('webpack-merge');
const log = require('./log');

/**
 * fsExists promise
 * @param {string} fp - filepath to check exists
 * @returns {Promise} fsExists
 */
const fsExists = fp => new Promise(
  resolve => fs.access(fp, err => resolve(!err))
);

const getPackageJsonPaths = (pattern, options = {}) => new Promise(
  resolve => glob(pattern, options, (err, matches) => resolve(matches))
);

const getPackageData = packagePath => new Promise(
  resolve => fs.readFile(packagePath, (err, data) => resolve({
    path: packagePath,
    data: JSON.parse(data),
  }))
);

const addToRules = (config, devPackage) => {
  config.module.rules.forEach(rule => {
    rule.include.push(devPackage.src);
  });
};

const addToAlias = (config, devPackage) => {
  config.resolve.alias[devPackage.name] = devPackage.src;
};

const findLocalPackages = (pattern, sourceField) => getPackageJsonPaths(pattern)
  .then(packageJsonPaths => Promise.all(packageJsonPaths.map(p => getPackageData(p))))
  .then(packages => packages.filter(p => (
    Object.prototype.hasOwnProperty.call(p.data, 'name')
    && Object.prototype.hasOwnProperty.call(p.data, sourceField)
  )))
  .then(packages => packages.map(p => ({
    name: p.data.name,
    // '../PackageName/package.json/../src'
    src: path.resolve(p.path, '..', p.data[sourceField]),
  })));

const configure = config => devPackages =>
  Promise.all(devPackages.filter(devPackage => fsExists(devPackage.src)))
    .then(existingDevPackages => {
      existingDevPackages.forEach(devPackage => {
        log.info(`Using ${devPackage.name} package from ${devPackage.src}`);
        // add the package path to the "include" array in each rule so it can
        // be processed with loaders
        addToRules(config, devPackage);
        // add alias for package pointing to local package path
        addToAlias(config, devPackage);
      });

      return Promise.resolve(config);
    });

const mergeConfigs = baseConfig => config =>
  webpackMerge(baseConfig, config);

const addLocalAlias = (
  baseConfig,
  rules = [],
  {
    searchPattern = '../*/package.json',
    sourceField = 'src', // function or string function will be given package.json
    quiet = false,
  } = {}) => {

  log.configure({quiet});

  // localAlias webpack config
  const config = {
    module: {
      rules,
    },
    resolve: {
      alias: {},
    },
  };

  return findLocalPackages(searchPattern, sourceField)
    .then(configure(config)) // pass localPackages to configure
    .then(mergeConfigs(baseConfig))
    .catch(err => log.error(err)); // eslint-disable-line no-console
};

module.exports = addLocalAlias;
