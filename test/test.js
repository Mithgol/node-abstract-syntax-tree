/* global describe, it */
var assert = require('assert');
var ASTree = require('../');

describe('AST constructor', function(){
   var AST = ASTree();
   it('has a list of splitters', function(){
      assert.ok( Array.isArray(AST.splitters) );
   });
   it('has a list of renderers', function(){
      assert.ok( Array.isArray(AST.renderers) );
   });
});