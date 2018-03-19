[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]

<div align="center">
  <a href="https://github.com/webpack/webpack" target="_blank">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <br>
  <h1>webpack-workspace</h1>
  <p>A <a href="https://github.com/webpack/webpack" target="_blank">webpack</a> development tool for managing JavaScript projects with multiple packages (without a monorepo).
  </p>
</div>

## tl;dr
**webpack-workspace** uses [webpack] to import node modules from a source directory instead of using the `node_modules/package-name` path.
```js
require('package-name'); //=> require('/path/to/workspace/package-name/src/index.js');
```
> You're able to quickly make changes to any of the packages in your workspace and see those changes reflected without having to build each package independently.

## Target Audience

You have a project that consists of multiple node packages. These packages share the same **workspace** directory or project root. Packages in this *workspace* depend on other packages in this workspace. You want to be able to import these packages from their *source* and not have to *build*, *transpile* or *bundle* dependencies each time you change one package.

## Example Use Case

You break up your project into 4 node packages called: `components`, `core`, `app`, and `server`. The `app` package imports the `core` and `components` packages, and the `server` package imports the `app` package like:
![dependencies-diagram]

You place all these packages in a single project root directory, in this document, called a **"workspace"**. At a high level, the file structure looks like:
```
workspace/
+-- components/
    +-- package.json
    +-- src/
    +-- node_modules/
+-- core/
    +-- package.json
    +-- src/
    +-- node_modules/
+-- app/
    +-- package.json
    +-- src/
    +-- node_modules/
        +-- components/
        +-- core/
+-- server/
    +-- package.json
    +-- dev-server.js
    +-- node_modules/
        +-- app/
```
Notice that the `app` package dependencies, `components` and `core` are built into it's local `node_modules/` directory.
Import statements in the `app` package for modules in the `components` or `core` packages are resolved using [webpack module-resolution] which normally looks in the local `./node_modules` directory for matching package names.
In your `app` package code, when you `require('core');` or `require('components');` webpack will look in `./node_modules/core/` and `./node_modules/components/`.

If you need to make changes to both the `core` and `app` packages, it can be inconvenient if you need to build each of these packages independently before seeing your changes reflected in a development server.

With little configuration, using **webpack-workspace**, you can specify a path pattern to *"workspaces"*, a directory that acts as a project root and contains multiple package source directories or repositories. **webpack-workspace** will look for valid node package directories in a workspace then add a [webpack `resolve.alias`] pointing to a source entry point for that node package directory.

When **webpack-workspace** is active, `require('core');` or `require('components');` will be evaluated as `require('../core/src/');` and `require('../components/src/');`.

> You're able to quickly make changes to any of the packages in your workspace and see those changes reflected without having to build each package independently.

## License

#### [MIT](./LICENSE)


[npm]: https://img.shields.io/npm/v/webpack-workspace.svg
[npm-url]: https://npmjs.com/package/webpack-workspace

[node]: https://img.shields.io/node/v/webpack-workspace.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack/webpack-workspace.svg
[deps-url]: https://david-dm.org/webpack/webpack-workspace

[tests]: http://img.shields.io/travis/webpack/webpack-workspace.svg
[tests-url]: https://travis-ci.org/webpack/webpack-workspace

[cover]: https://codecov.io/gh/webpack/webpack-workspace/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack/webpack-workspace

[webpack]: https://webpack.js.org
[webpack module-resolution]: https://webpack.js.org/concepts/module-resolution/
[webpack `resolve.alias`]: https://webpack.js.org/configuration/resolve/#resolve-alias

[learna]: https://github.com/lerna/lerna

[dependencies-diagram]: https://user-images.githubusercontent.com/1919664/37572680-e2faa826-2acb-11e8-9478-310d5959574d.jpg
