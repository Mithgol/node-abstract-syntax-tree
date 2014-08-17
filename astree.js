var ASTree = function(){
   if (!(this instanceof ASTree)) return new ASTree();

   this.splitters = [];
   this.renderers = [];
};

ASTree.prototype.render = function(initialString){
   var prevArray, nextArray;
   prevArray = [initialString];

   this.splitters.forEach(function(nextSplitter){
      nextArray = [];
      prevArray.forEach(function(nextPrevItem){
         nextArray = nextArray.concat(
            nextSplitter(nextPrevItem)
         );
      });
      prevArray = nextArray;
   });
};

ASTree.prototype.addSplitter = function(splitter, supportedNodeTypes){
   if( typeof supportedNodeTypes === 'undefined' ) supportedNodeTypes = [];
   this.splitters.push({
      'splitter': splitter,
      'supportedNodeTypes': supportedNodeTypes
   });
};

module.exports = ASTree;