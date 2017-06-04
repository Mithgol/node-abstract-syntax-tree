This module (`node-abstract-syntax-tree`) is an implementation of AST (abstract syntax tree).

The module is written in JavaScript and requires [Node.js](http://nodejs.org/) to run.
* Starting from v2.0.0, this module requires Node.js version 4.0.0 or newer. This module is tested against Node.js v4 and against the latest stable version of Node.js.
* You may run older versions of this module in Node.js version 0.10.x or 0.12.x. These older versions of this module, however, had to contain an additional dependency ([`array.prototype.find`](https://www.npmjs.com/package/array.prototype.find)) as a polyfill for a missing [ECMAScript 2015 (ES6) feature](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) which is now a part of Node.js. And those older versions of Node.js are themselves not maintained by their developers after 2016-12-31.

It is planned as a tool that assists in building renderers of markup languages, renderers that convert some initial string (for example, a text marked with [Markdown](http://daringfireball.net/projects/markdown/) or [WakabaMark](http://wakaba.c3.cx/docs/docs.html#WakabaMark)) to its another string form (for example, HTML5) using an abstract syntax tree as an intermediate representation.

## Installing the AST module

[![(npm package version)](https://nodei.co/npm/astree.png?downloads=true)](https://npmjs.org/package/astree) [![(a histogram of downloads)](https://nodei.co/npm-dl/astree.png?months=3)](https://npmjs.org/package/astree)

* Latest packaged version: `npm install astree`

* Latest githubbed version: `npm install https://github.com/Mithgol/node-abstract-syntax-tree/tarball/master`

The npm package does not contain the tests, they're published on GitHub only.

You may visit https://github.com/Mithgol/node-abstract-syntax-tree#readme occasionally to read the latest `README` because the package's version is not planned to grow after changes when they happen in `README` only. (And `npm publish --force` is [forbidden](http://blog.npmjs.org/post/77758351673/no-more-npm-publish-f) nowadays.)

## Using the AST module

When you `require()` the installed module, you get a constructor that can be used to create AST instances:

```js
var ASTree = require('astree');
var someTree = ASTree();
```

(John Resig's [self-calling constructor](http://ejohn.org/blog/simple-class-instantiation/) is used and thus the `new` keyword is optional.)

A constructed object has the following methods:

### render(inputString)

Renders the given `inputString` to some output string, using an abstract syntax tree as an intermediate representation.

The work consists of the following two parts:

1. **Splitting.** The given `inputString` is split into an array that represents an abstract syntax tree.

2. **Rendering.** Items of the generated abstract syntax tree are rendered to strings.

#### Splitting

Splitters are applied in the order of appearance, i.e. in the order they were defined by calls to the `.defineSplitter` method (see below).

Each splitter is applied individually to each of the elements of the array representing the abstract syntax tree in its state left from the previous splitter.

The results of such application (i.e. whatever is returned from the splitter) are concatenated to a new array. (The next splitter is applied to the elements of that new array.)

There's no AST before the first splitter, and thus the first splitter is applied to `inputString`.

Concatenations are performed by the [`Array.prototype.concat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) method. Therefore,

* if a splitter returns an array, elements of that array are individually concatenated to the AST;

* if a splitter returns something else, the returned value becomes a single element in the AST;

* if a splitter has nothing to add to the AST (i.e. it erases from the AST an element that was given to the splitter), it should return an empty array.

#### Rendering

Renderers are applied to elements of the array that represents the AST in its final form (i.e. after the last splitter), converting these elements to JavaScript strings:

* If an element (`targetElement`) is an object and a renderer for its type (`targetElement.type`) was defined by a call to the `.defineRenderer` method (see below), then that renderer is called and its returned result replaces the `targetElement` in the AST.

* If an element does not have such a corresponding renderer, a mere `.toString` is called to convert it to a string. (Unless it's already a JavaScript string and thus there's nothing to do.)

Afterwards the elements of the AST are concatenated (in order of appearance) to a larger string, and that string is returned from the `.render` method.

### defineSplitter(splitter, supportedNodeTypes)

Adds a splitter (also known as a tokenizer) to a tree. That splitter is later applied to individual elements of the AST when the `.render()` method is called.

The `splitter` value must be a function that has only one parameter (for input data), e.g. `function(inputData){…}`.

By default, when the splitter is applied to some element of the AST (`targetElement`), a simple `splitter(targetElement)` call is performed, and the returned value becomes a part of the new AST.

However, that simple default behaviour might be changed by an optional `supportedNodeTypes` array (empty by default); that array contains descriptions of known node types supported by the splitter. Each of elements of the `supportedNodeTypes` must be an object with the following properties:

* `type` — a JavaScript string ID of the supported node's type.

* `props` — an array of JavaScript strings containing names of the targeted properties of such node.

If `targetElement` is an object and if `targetElement.type` is a property containing an ID of one of the supported types, then the default behaviour changes to the following two steps:

1. `splitter` is applied to each of the targeted properties of `targetElement` as if that property were an AST:
   * `targetElement[propertyName] = targetElement[propertyName].map(splitter)` for array properties
   * `targetElement[propertyName] = [ splitter(targetElement[propertyName]) ]` for non-array properties

2. `targetElement` is returned to become a part of the new AST.

It is therefore possible to use `supportedNodeTypes` to support branches (subtrees) of AST as properties of some known node types.

#### Example

```js
someTree.defineSplitter(
   function(inputData){
      if( typeof inputData !== 'string' ) return inputData;
      return require('uue').split(inputData);
   }, [
      { type: 'quote', props: [ 'quotedText' ] }
   ]
);
```

In this example [the UUE module's](https://github.com/Mithgol/node-uue/) [`.split(text)`](https://github.com/Mithgol/node-uue/#splittext) method is added to a tree as a splitter:

* That splitter later will be used to get UUE-decoded files from the text input.

* That splitter rejects other (non-text) types of input by returning them verbatim (and they'll be concatenated to the new AST “as is”).

* That splitter can also process text from quotes (i.e. in the AST nodes representing quotes that appeared within the original text). A support for such processing is achieved merely by passing an item in `supportedNodeTypes` (the splitter's source code itself in not altered).

### defineRenderer(supportedNodeTypes, renderer)

`supportedNodeTypes` is an array of node type identifiers. If one of them is equal to `targetElement.type` of some node in the AST, then the renderer is applied to that node.

`renderer` is a `function(targetElement, renderAST)` that gets the target element (some node from the AST) and should render it to a string and return that string. It also gets the helper method `renderAST`. If some property of the `targetElement` is actually a subtree of AST (represented by an array of strings and nodes), the renderer may apply `renderAST()` to the value of that property and get a string out of it.

## Testing the AST module

[![(build testing status)](https://img.shields.io/travis/Mithgol/node-abstract-syntax-tree/master.svg?style=plastic)](https://travis-ci.org/Mithgol/node-abstract-syntax-tree)

The tests are not included in the npm package of the module (to keep it small). Use the version from GitHub.

It is necessary to install [Mocha](https://mochajs.org/) and [JSHint](http://jshint.com/) for testing.

* You may install Mocha globally (`npm install mocha -g`) or locally (`npm install mocha` in the directory of the AST module).

* You may install JSHint globally (`npm install jshint -g`) or locally (`npm install jshint` in the directory of the AST module).

After that you may run `npm test` (in the directory of the AST module).

## License

MIT license (see the `LICENSE` file).
