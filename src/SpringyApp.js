module.exports = (function SpringyApp() {
      // Internal Shared Methods
   var _methods = {
         /**
          * @return {boolean}
          */
         resetGraph: function() {
            if (GRAPH.nodes.length) {
               if (window.confirm('Do you want to save the current graph data?')) {
                  if (!saveData()) return false
               }
               GRAPH.filterNodes(function() {
                  return false
               })
            }
            log('Started a new graph', {
               label: 'info'
            })
            return true
         },
         /**
          * @return {boolean}
          */
         saveData: function() {
            try {
               var blob = new Blob([JSON.stringify(GRAPH.getData())], {
                  type: 'application/json'
               })
               window.saveAs(blob, 'graph.json')
            }
            catch (err) {
               log('Cannot save data. ' + err.message, {
                  label: 'fail'
               })
               return false
            }
            log('Data saved to file', {
               label: 'info'
            })
            return true
         },
         /**
          * @param {File object} file
          * @return {boolean}
          */
         importData: function(file) {
            var reader = new FileReader()
            reader.onload = function(e) {
               try {
                  var data = JSON.parse(e.target.result)
                  if (!data.nodes || !data.edges) {
                     throw 'There is no "nodes" or "edges" property'
                  }
                  GRAPH.loadJSON(e.target.result)
                  return true
               }
               catch (err) {
                  log('Cannot import data. ' + err.message, {
                     label: 'fail'
                  })
                  return false
               }
            }
            reader.readAsText(file, 'application/json')
         },
         /**
          * @param {string} name
          * @return {boolean}
          */
         addNode: function(name) {
            if (!GRAPH.getNode(name)) {
               GRAPH.addNodes(name)
               var actions = {
                  undo: function() {
                     removeNode(name)
                  },
                  label: 'success'
               }
               log('Added node ' + name, actions)
               return true
            }
            else {
               log('Cannot add node ' + name, {
                  label: 'fail'
               })
               return false
            }
         },
         /**
          * @param {string} name
          * @return {boolean}
          */
         removeNode: function(name) {
            var n

            if ((n = GRAPH.getNode(name))) {
               GRAPH.removeNode(n)
               var actions = {
                  undo: function() {
                     addNode(name)
                  },
                  label: 'success'
               }
               log('Removed node ' + name, actions)
               return true
            }
            else {
               log('Cannot remove node ' + name, {
                  label: 'fail'
               })
               return false
            }
         },
         /**
          * @param {string} start
          * @param {end} end
          * @return {boolean}
          */
         addEdge: function(start, end) {
            var ns = GRAPH.getNode(start),
               ne = GRAPH.getNode(end),
               edge = GRAPH.getEdges(ns, ne)

            if (ns && ne && !edge.length && start !== end) {
               GRAPH.addEdges([start, end])
               var actions = {
                  undo: function() {
                     removeEdge(start, end)
                  },
                  label: 'success'
               }
               log('Added edge ' + start + ' to ' + end, actions)
               return true
            }
            else {
               log('Cannot add edge ' + start + ' to ' + end, {
                  label: 'fail'
               })
               return false
            }
         },
         /**
          * @param {string} start
          * @param {string} end
          * @return {boolean}
          */
         removeEdge: function(start, end) {
            var ns = GRAPH.getNode(start),
               ne = GRAPH.getNode(end),
               edge = GRAPH.getEdges(ns, ne)

            if (ns && ne && edge.length && start !== end) {
               GRAPH.removeEdge(edge[0])
               var actions = {
                  undo: function() {
                     addEdge(start, end)
                  },
                  label: 'success'
               }
               log('Removed edge ' + start + ' to ' + end, actions)
               return true
            }
            else {
               log('Cannot remove edge ' + start + ' to ' + end, {
                  label: 'fail'
               })
               return false
            }
         },
         /**
          * @param {string} start
          * @param {string} end
          * @return {boolean}
          */
         shortestPath: function(start, end) {
            if (start == end || !GRAPH.getNode(start) || !GRAPH.getNode(end)) {
               log('Cannot find path ' + start + ' to ' + end, {
                  label: 'fail'
               })
               return false
            }

            var edges = GRAPH.getAllEdges()
            var degree = [],
               path = []

            if (_solve([start], 0)) {
               log('Solved path ' + start + ' to ' + end + '<br>[' + _constructPath() + ']', {
                  label: 'success'
               })
               return true
            }
            else {
               log('Cannot solve path ' + start + ' to ' + end, {
                  label: 'fail'
               })
               return false
            }

            function _constructPath() {
               GRAPH.resetEdgeColors()
               var edge, local_end = end
               for (var i = degree.length; i--;) {
                  edge = degree[i].filter(node => node[1] == local_end)[0]
                  GRAPH.modifyEdgeColor(edge, 'teal')
                  path.unshift(edge[1]);
                  path.unshift(edge[0])
                  local_end = edge[0]
               }
               return path.filter((node, i, nodes) => nodes.indexOf(node) === i).join(' > ')
            }

            function _solve(start_nodes, i) {
               degree[i] = []
               start_nodes.forEach(start_node => {
                  for (var j = edges.length; j--;) {
                     if (edges[j][0] == start_node)
                        degree[i].push(edges.splice(j, 1)[0])
                  }
               })

               if (degree[i].length) {
                  var neighbor_nodes = degree[i].map(edge => edge[1]).filter((node, i, nodes) => nodes.indexOf(node) === i)
                  if (neighbor_nodes.indexOf(end) != -1)
                     return true
                  else
                     return _solve(neighbor_nodes, ++i)
               }
               else
                  return false
            }
         },
         log: function(msg, options) {

         }
      }
      // Internal Shared Utility Functions
   function _submit(method_name, method_params) {
      var input_vals = input_els.map(el => el.val().trim())
      if (_valid(input_vals)) {
         if (_methods[method_name].apply(this, input_vals))
      }
      else {
         this.LOG('Invalid input for ' + method_name, {
            label: 'fail'
         })
      }

      function _valid(vals) {
         return vals.every(val => {
               return /[\S]+/.test(val)
            }) // every input value has one non-space character
            && vals.length == func.length // number of input values matches number of expected arguments in func
      }
   }

   /**
    * @param {HTMLElement} canvas [required]
    * @param {function} log [optional]
    * @param {object} initial_data [optional]
    *  : expects -> { 'nodes': ['name', ... ],
    *                 'edges': [ ['name', 'name'], ... ] }
    */
   function constructor(canvas, log, initial_data) {
      // Setup the instance
      var graph = new Springy.Graph() // instance variable
      graph.loadJSON(initial_data)
      $(canvas).springy({
            graph: graph
      }) // jQuery has been extended by SpringyUI

      if (typeof log !== 'function') {
         log = function() {
            return false
         }
      }
      return graph
   }
   // _methods names are being put on the prototype so that they can be called externally
   // and the call will go through _submit first
   constructor.prototype = (function() {
      var prototype = {}
      Object.keys(_methods).forEach(method_name => {
         prototype[method_name] = function() {
            _submit.call(this, method_name, Array.slice.call(arguments))
         }
      })
      return prototype
   })()
   return constructor
})()