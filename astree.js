var ASTree = function(){
   if (!(this instanceof ASTree)) return new ASTree();

   this.splitters = [];
   this.renderers = [];
};

module.exports = ASTree;