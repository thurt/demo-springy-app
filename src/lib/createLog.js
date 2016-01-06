module.exports = function(el) {
   function log(msg, opts) {
      log.transformer(msg, opts)
      log.el.appendChild(msg)
   }
   log.transformer = require('./src/lib/createTransformer')({
      'label': function(type) {
         var label = document.createElement('i')
         switch (type) {
            case 'info':
               label.classList.add('fa')
               label.classList.add('fa-info-circle')
               label.style.color = 'blue'
               break
            case 'success':
               label.classList.add('fa')
               label.classList.add('fa-check-circle')
               label.style.color = 'green'
               break
            case 'fail':
               label.classList.add('fa')
               label.classList.add('fa-times-circle')
               label.style.color = 'red'
               break
            default:
               return this // type not recognized. do nothing
         }
         label.appendChild(this)
         return label
      }
   })
   log.el = el
   return log
}