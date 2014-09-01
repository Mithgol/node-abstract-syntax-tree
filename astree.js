require('array.prototype.find');

var ASTree = function(){
   if (!(this instanceof ASTree)) return new ASTree();

   this.splitters = [];
   this.renderers = [];

   this.renderAST = this.ASTRenderer.bind(this);
};

ASTree.prototype.ASTRenderer = function(AST){
   var sourceArray = AST;
   var _this = this;
   if( !Array.isArray(sourceArray) ) sourceArray = [ sourceArray ];

   return sourceArray.map(function(sourceItem){
      if( typeof sourceItem === 'string' ) return sourceItem;
      if( typeof sourceItem.type === 'undefined' ){
         return sourceItem.toString();
      }
      var foundRenderer = _this.renderers.find(function(someRenderer){
         return someRenderer.supportedNodeTypes.indexOf(
            sourceItem.type
         ) > -1;
      });
      if( typeof foundRenderer === 'undefined' ) return sourceItem.toString();

      return foundRenderer.renderer( sourceItem, _this.renderAST );
   }).join('');
};

ASTree.prototype.render = function(initialString){
   var prevArray, nextArray;
   prevArray = [initialString];

   this.splitters.forEach(function(nextSplitter){
      nextArray = [];
      prevArray.forEach(function(targetElement){
         var supportedNode = nextSplitter.supportedNodeTypes.find(function(
            supportedNodeType
         ){
            return targetElement.type === supportedNodeType.type;
         });
         if( typeof supportedNode === 'undefined' ){
            // default behaviour: apply the splitter to the target element
            nextArray = nextArray.concat(
               nextSplitter.splitter(targetElement)
            );
            return;
         }
         // changed behaviour: apply the splitter to the targeted properties
         supportedNode.props.forEach(function(targetedPropName){
            if( Array.isArray(targetElement[targetedPropName]) ){
               var nextPropValue = [];
               targetElement[targetedPropName].forEach(function(propItem){
                  nextPropValue = nextPropValue.concat(
                     nextSplitter.splitter(propItem)
                  );
               });
               targetElement[targetedPropName] = nextPropValue;
            } else if(
               typeof targetElement[targetedPropName] !== 'undefined'
            ){
               targetElement[targetedPropName] = nextSplitter.splitter(
                  targetElement[targetedPropName]
               );
            }
         });
         nextArray = nextArray.concat(targetElement);
      });
      prevArray = nextArray;
   });
   prevArray = null;
   return this.renderAST( nextArray );
};

ASTree.prototype.defineSplitter = function(splitter, supportedNodeTypes){
   if( typeof supportedNodeTypes === 'undefined' ) supportedNodeTypes = [];
   this.splitters.push({
      'splitter': splitter,
      'supportedNodeTypes': supportedNodeTypes
   });
};

ASTree.prototype.defineRenderer = function(supportedNodeTypes, renderer){
   if( !Array.isArray(supportedNodeTypes) || supportedNodeTypes.length < 1 ){
      throw new Error('Wrong `supportedNodeTypes` in `.defineRenderer`.');
   }
   this.renderers.push({
      'renderer': renderer,
      'supportedNodeTypes': supportedNodeTypes
   });
};

module.exports = ASTree;