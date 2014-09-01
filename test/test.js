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
   it('has an AST renderer', function(){
      assert.strictEqual( typeof AST.renderAST, 'function' );
   });
});

describe('string-to-string conversion', function(){
   var AST = ASTree();

   AST.defineSplitter(function(sourceText){
      return sourceText.split(
         /\*(.*?)\*/
      ).map(function(sourceItem, sourceIDX){
         if( sourceIDX % 2 === 0 ){ // simple string fragment's index: 0, 2...
            return sourceItem;
         } else { // regex-captured fragment's index: 1, 3, 5...
            return {
               type: 'boldText',
               content: sourceItem
            };
         }
      });
   });

   AST.defineSplitter(function(sourceText){
      return sourceText.split(
         /_(.*?)_/
      ).map(function(sourceItem, sourceIDX){
         if( sourceIDX % 2 === 0 ){ // simple string fragment's index: 0, 2...
            return sourceItem;
         } else { // regex-captured fragment's index: 1, 3, 5...
            return {
               type: 'italicText',
               content: sourceItem
            };
         }
      });
   }, [
      { type: 'boldText', props: [ 'content' ] }
   ]);

   AST.defineRenderer([ 'boldText' ], function(item, renderer){
      return '<b>' + renderer(item.content) + '</b>';
   });

   AST.defineRenderer([ 'italicText' ], function(item, renderer){
      return '<i>' + renderer(item.content) + '</i>';
   });

   it('renders *bold text* to <b>bold text</b>', function(){
      assert.strictEqual(
         AST.render('some *bold* text'),
         'some <b>bold</b> text'
      );
   });

   it('renders _italic text_ to <i>italic text</i>', function(){
      assert.strictEqual(
         AST.render('some _italic_ text'),
         'some <i>italic</i> text'
      );
   });

   it('renders *_complex text_* to <b><i>complex text</i></b>', function(){
      assert.strictEqual(
         AST.render('some *_complex_* text'),
         'some <b><i>complex</i></b> text'
      );
   });

   it('renders *garbage_ *text_ to <b>garbage_ </b>text_', function(){
      assert.strictEqual(
         AST.render('some *garbage_ *text_'),
         'some <b>garbage_ </b>text_'
      );
   });
});