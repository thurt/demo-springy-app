/* global Springy */
function SpringyApp(canvas, log, initial_data) {
  // Setup the instance
  this.graph = new Springy.Graph()
  if (initial_data !== undefined) this.graph.loadJSON(initial_data)

  Object.assign(this.graph, graph_mods)

  $(canvas).springy({
      graph: this.graph
    }) // jQuery has been extended by SpringyUI

  if (log === undefined) {
    this.log = function () {
      return false
    }
  } else {
    this.log = log
  }
}
SpringyApp.prototype = {
  resetGraph: function () {
    if (this.graph.nodes.length) {
      if (window.confirm('Do you want to save the current graph data?')) {
        if (!this.saveData()) return false
      }
      this.graph.filterNodes(function () {
        return false
      })
    }

    return true
  },
  saveData: function () {
    try {
      var blob = new Blob([JSON.stringify(this.graph.getData())], { type: 'application/json' })
      window.saveAs(blob, 'graph.json')
    }
    catch (err) {
      this.log('Cannot save data. ' + err.message, {
        label: 'fail'
      })
      return false
    }

    return true
  },
  loadData: function (file) {
    var reader = new FileReader()
    reader.onload = (function (e) {
      try {
        var data = JSON.parse(e.target.result)
        if (!data.nodes || !data.edges) {
          throw 'There is no "nodes" or "edges" property'
        }
        this.resetGraph()
        this.graph.loadJSON(e.target.result)
        this.log('Loaded Data', { label: 'info' })
      }
      catch (err) {
        this.log('Cannot import data. ' + err.message, {
          label: 'fail'
        })
      }
    }).bind(this)
    reader.readAsText(file, 'application/json')
  },
  addNode: function (name) {
    if (!this.graph.getNode(name)) {
      this.graph.addNodes(name)
      this.log('Added node ' + name, { label: 'success' })
      return true
    }
    else {
      this.log('Cannot add node ' + name, {
        label: 'fail'
      })
      return false
    }
  },
  removeNode: function (name) {
    var n

    if ((n = this.graph.getNode(name))) {
      this.graph.removeNode(n)
      this.log('Removed node ' + name, { label: 'success' })
      return true
    }
    else {
      this.log('Cannot remove node ' + name, {
        label: 'fail'
      })
      return false
    }
  },
  addEdge: function (start, end) {
    var ns = this.graph.getNode(start),
      ne = this.graph.getNode(end),
      edge = this.graph.getEdges(ns, ne)

    if (ns && ne && !edge.length && start !== end) {
      this.graph.addEdges([start, end])
      this.log('Added edge ' + start + ' to ' + end, { label: 'success' })
      return true
    }
    else {
      this.log('Cannot add edge ' + start + ' to ' + end, {
        label: 'fail'
      })
      return false
    }
  },
  removeEdge: function (start, end) {
    var ns = this.graph.getNode(start),
      ne = this.graph.getNode(end),
      edge = this.graph.getEdges(ns, ne)

    if (ns && ne && edge.length && start !== end) {
      this.graph.removeEdge(edge[0])
      this.log('Removed edge ' + start + ' to ' + end, { label: 'success' })
      return true
    }
    else {
      this.log('Cannot remove edge ' + start + ' to ' + end, {
        label: 'fail'
      })
      return false
    }
  },
  shortestPath: function (start, end) {
    if (start == end || !this.graph.getNode(start) || !this.graph.getNode(end)) {
      this.log('Cannot find path ' + start + ' to ' + end, {
        label: 'fail'
      })
      return false
    }

    var edges = this.graph.getAllEdges()
    var degree = [],
      path = []

    if (_solve([start], 0)) {
      this.log('Solved path ' + start + ' to ' + end + ' [' + _constructPath.call(this) + ']', {
        label: 'success'
      })
      return true
    }
    else {
      this.log('Cannot solve path ' + start + ' to ' + end, {
        label: 'fail'
      })
      return false
    }

    function _constructPath() {
      this.graph.resetEdgeColors()
      var edge, local_end = end
      for (var i = degree.length; i--;) {
        edge = degree[i].filter(node => node[1] == local_end)[0]
        this.graph.modifyEdgeColor(edge, 'teal')
        path.unshift(edge[1])
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
  }
}

// Mods to Springy prototype
var graph_mods = {
  getNode: function(name) {
     for (var node of this.nodes) {
        if (node.id == name)
           return node
     }
     return false
  },
  getAllEdges: function() {
     return this.edges.map(edge => [edge.source.id, edge.target.id])
  },
  modifyEdgeColor: function(edge, color) {
     this.edges.some(Springy_e => {
        if (Springy_e.source.id == edge[0] && Springy_e.target.id == edge[1]) {
           Springy_e.data.color = color
           this.notify()
           return true
        }
     })
  },
  resetEdgeColors: function() {
     this.edges.forEach(e => delete e.data.color)
     this.notify()
  },
  getData: function() {
     var data = {
        "nodes": [],
        "edges": []
     }
     this.nodes.forEach(node => data.nodes.push(node.id))
     this.edges.forEach(edge => data.edges.push([edge.source.id, edge.target.id]))
     return data
  }
}



