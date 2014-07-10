This project (`node-abstract-syntax-tree`) is an implementation of AST (abstract syntax tree) for Node.js.

It can be used to build renderers of markup languages.

## Installing the AST module

[![(npm package version)](https://nodei.co/npm/astree.png?downloads=true)](https://npmjs.org/package/astree) [![(a histogram of downloads)](https://nodei.co/npm-dl/astree.png?months=3)](https://npmjs.org/package/astree)

* Latest packaged version: `npm install astree`

* Latest githubbed version: `npm install https://github.com/Mithgol/node-abstract-syntax-tree/tarball/master`

The npm package does not contain the tests, they're published on GitHub only.

You may visit https://github.com/Mithgol/node-abstract-syntax-tree#readme occasionally to read the latest `README` because the package's version is not planned to grow after changes when they happen in `README` only. (And `npm publish --force` is [forbidden](http://blog.npmjs.org/post/77758351673/no-more-npm-publish-f) nowadays.)

## Testing the AST module

The tests are not included in the npm package of the module (to keep it small). Use the version from GitHub.

It is necessary to install [Mocha](http://visionmedia.github.io/mocha/) and [JSHint](http://jshint.com/) for testing.

* You may install Mocha globally (`npm install mocha -g`) or locally (`npm install mocha` in the directory of the AST module).

* You may install JSHint globally (`npm install jshint -g`) or locally (`npm install jshint` in the directory of the AST module).

After that you may run `npm test` (in the directory of the AST module).

## License

MIT license (see the `LICENSE` file)