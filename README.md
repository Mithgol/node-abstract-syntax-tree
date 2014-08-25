This project (`node-abstract-syntax-tree`) is an implementation of AST (abstract syntax tree) for Node.js.

It is planned as a tool that assists in building renderers of markup languages, renderers that convert some initial string (for example, a text marked with [Markdown](http://daringfireball.net/projects/markdown/) or [WakabaMark](http://wakaba.c3.cx/docs/docs.html#WakabaMark)) to its another string form (for example, HTML5) using an abstract syntax tree as an intermediate representation.

**Note:**   the module is currently in an early phase of its development and thus does not have even minimal feature completeness.

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

# **Splitting.** The given `inputString` is split into an array that represents an abstract syntax tree.

# **Rendering.** Items of the generated abstract syntax tree are rendered

### addSplitter(splitter, supportedNodeTypes)

Adds a splitter (also known as a tokenizer) to a tree.

Each splitter impements a step of building a tree. When a tree is built out of its initial (string) representation, the splitters are called in the order of appearance (i.e. in the order in which `.addSplitter` method calls added the splitters to a tree):

* The first splitter receives the initial (string) representation of the tree and returns an array of tree nodes it could create from that string.

* The next splitter is called for each of the elements of the array returned from the previous splitter and then the returned arrays are contatenated.

And thus the following requirements for the `splitter` given to the `.addSplitter` method:

* `splitter` must be a function that has only one parameter (for input data), e.g. `function(inputData){…}`.

* When `splitter` is called, that `inputData` parameter is either a JavaScript string (a part or a whole of the initial representation) or a JavaScript object (representing a tree's node), the latter always has a property `type` (a JavaScript string ID of the node's type).

* `splitter` must return a JavaScript array. If the array is not empty, each of its elements must be either a JavaScript string or a JavaScript object (representing a tree's node), the latter must have a property `type` (a JavaScript string ID of the node's type).

An optional `supportedNodeTypes` array (empty by default) contains descriptions of known node types supported by the splitter. Each of elements of the `supportedNodeTypes` must be an object with the following properties:

* `type` — a JavaScript string ID of the supported node's type.

* `props` — an array of JavaScript strings containing the targeted properties of that node.

When a tree's node (a JavaScript object) is encountered in array returned by the previous splitter, the next splitter is applied differently if the node is supported:

* if the node's not supported, `splitter(node)` is called and the returned array is used

* if the node's supported, than for each of the targeted properties of that node:
   * if the property's value is a string, it is replaced by `splitter(value)`
   * if the property's value is an array, then `splitter(element)` is called for each of the array's elements and then the results are concatenated to an array that replaces the property's value

* then (if the node's supported) an array containing the modified node (`[node]`) is used

**Example:**

```js
someTree.addSplitter(
   function(inputData){
      if( typeof inputData !== 'string' ) return [ inputData ];
      return require('uue').split(inputData);
   }, [
      { type: 'quote', props: [ 'quotedText' ] }
   ]
);
```

In this example [the UUE module's](https://github.com/Mithgol/node-uue/) [`.split(text)`](https://github.com/Mithgol/node-uue/#splittext) method is added to a tree as a splitter:

* That splitter later will be used to get UUE-decoded files from the text input.

* That splitter rejects other (non-text) types of input by returning them as is (though wrapped in an array, because that's what a splitter must do).

* That splitter can also process text from quotes (in the nodes representing quotes that appeared within the original text). A support for such processing is achieved by passing an item in `supportedNodeTypes` (the splitter's source code in not altered).

## Testing the AST module

[![(build testing status)](https://travis-ci.org/Mithgol/node-abstract-syntax-tree.svg?branch=master)](https://travis-ci.org/Mithgol/node-abstract-syntax-tree)

The tests are not included in the npm package of the module (to keep it small). Use the version from GitHub.

It is necessary to install [Mocha](http://visionmedia.github.io/mocha/) and [JSHint](http://jshint.com/) for testing.

* You may install Mocha globally (`npm install mocha -g`) or locally (`npm install mocha` in the directory of the AST module).

* You may install JSHint globally (`npm install jshint -g`) or locally (`npm install jshint` in the directory of the AST module).

After that you may run `npm test` (in the directory of the AST module).

## License

MIT license (see the `LICENSE` file).
