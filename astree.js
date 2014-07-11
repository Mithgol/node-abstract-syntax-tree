var ASTree = function(){
   if (!(this instanceof ASTree)) return new ASTree();

   this.splitters = [];
   this.renderers = [];
};

ASTree.prototype.addSplitter = function(splitter, supportedNodeTypes){
   if( typeof supportedNodeTypes === 'undefined' ) supportedNodeTypes = [];
   this.splitters.push(splitter, supportedNodeTypes);
};

module.exports = ASTree;