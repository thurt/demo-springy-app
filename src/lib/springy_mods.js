 /* global Springy */
module.exports = (function() {
   Springy.Graph.prototype.getNode = function(name) {
      for (var node of this.nodes) {
         if (node.id == name)
            return node
      }
      return false
   }
   Springy.Graph.prototype.getAllEdges = function() {
      return this.edges.map(edge => [edge.source.id, edge.target.id])
   }
   Springy.Graph.prototype.modifyEdgeColor = function(edge, color) {
      this.edges.some(Springy_e => {
         if (Springy_e.source.id == edge[0] && Springy_e.target.id == edge[1]) {
            Springy_e.data.color = color
            this.notify()
            return true
         }
      })
   }
   Springy.Graph.prototype.resetEdgeColors = function() {
      this.edges.forEach(e => delete e.data.color)
      this.notify()
   }
   Springy.Graph.prototype.getData = function() {
      var data = {
         "nodes": [],
         "edges": []
      }
      this.nodes.forEach(node => data.nodes.push(node.id))
      this.edges.forEach(edge => data.edges.push([edge.source.id, edge.target.id]))
      return data
   }
})()