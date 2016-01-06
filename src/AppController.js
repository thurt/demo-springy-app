var $ = jQuery = require('jquery')
var Springy = require('springy')
var SpringyApp = require('./src/SpringyApp')
var lib = require('./src/lib')

// IIFE
require('springy/./springyui') // Springy must be defined first
require('./src/springy_prototype_mods') // Springy must be defined first

$(document).ready(function() {
   // Initialization -------------------------------------------------------------

   // create a new SpringyApp -- requires a <canvas> to attach to
   var APP = new SpringyApp(document.getElementById('canvas'))

   // Create a log for this application
   var LOG = lib.createLog(document.getElementById('log'))

   // LOG will be called whenever APP has an event
   APP.subscribe(LOG)

   // load some demo data -- you can load more data whenever you like
   APP.loadData({
      "nodes": ["a", "b", "c", "d", "e", "f"],
      "edges": [
         ["a", "b"],
         ["a", "d"],
         ["b", "c"],
         ["b", "f"],
         ["c", "f"],
         ["f", "d"],
         ["c", "e"],
         ["f", "e"],
         ["d", "e"]
      ]
   })

   // Wire-Up Input Actions -------------------------------------------------------
   //// input fields
   var add_node = document.getElementById('add-node')
   var remove_node = document.getElementById('remove-node')
   var add_edge = [document.getElementById('add-edge-start'), document.getElementById('add-edge-end')]
   var remove_edge = [document.getElementById('remove-edge-start'), document.getElementById('remove-edge-end')]
   var shortest_path = [document.getElementById('shortest-path-start'), document.getElementById('shortest-path-end')]

   //// trigger an application method when pressing 'enter'(key code 13) inside an input field
   add_node.onkeydown = e => {
      if (e.which == 13 && APP.addNode(add_node.value))
         add_node.value = ''
   }
   remove_node.onkeydown = e => {
      if (e.which == 13 && APP.removeNode(remove_node.value))
         remove_node.value = ''
   }
   add_edge.forEach(input => {
      input.onkeydown = e => {
         if (e.which == 13 && APP.addEdge(add_edge[0].value, add_edge[1].value)) {
            add_edge[0].value = ''
            add_edge[1].value = ''
         }
      }
   })
   remove_edge.forEach(input => {
      input.onkeydown = e => {
         if (e.which == 13 && APP.removeEdge(remove_edge[0].value, remove_edge[1].value)) {
            remove_edge[0].value = ''
            remove_edge[1].value = ''
         }
      }
   })
   shortest_path.forEach(input => {
      input.onkeydown = e => {
         if (e.which == 13 && APP.shortestPath(shortest_path[0].value, shortest_path[1].value)) {
            shortest_path[0].value = ''
            shortest_path[1].value = ''
         }
      }
   })

   //// top-bar actions
   // 'load-data' is a proxy element that I use to visually represent
   // the action in the way I want. This allows me to hide the default
   // HTML5 visual behavior of 'import-data-input'
   document.getElementById('load-data').onclick = e => {
      e.preventDefault();
      // transferring click event to the hidden element
      document.getElementById('import-data-input').dispatchEvent(new Event('click'))
   }
   document.getElementById('load-data-input').onchange = e => {
      APP.importData(e.target.files[0])
   }
   document.getElementById('save-data').onclick = e => {
      e.preventDefault();
      APP.saveData()
   }
   document.getElementById('new-graph').onclick = e => {
      e.preventDefault();
      APP.resetGraph()
   }

})