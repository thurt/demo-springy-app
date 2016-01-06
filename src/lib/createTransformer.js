module.exports = function createTransformer(methods) {
   if (typeof methods !== 'object') methods = {}

   function transform(target, methodsToCall) {
      methodsToCall.forEach(name => {
         if (name in methods)
            target = methods[name].apply(target, methodsToCall[name])
         else
            throw new ReferenceError('This transformer does not support transform method ' + name)
      })
   }
   Object.defineProperties(transform, {
      methods: {
         get: function() {
            return Object.keys(methods)
         }
      },
      add: {
         value: function(name, func) {
            if (!methods[name] && typeof func === 'function') {
               methods[name] = func
            }
         }
      },
      remove: {
         value: function(name) {
            if (methods[name]) {
               delete methods[name]
            }
         }
      }
   })
   return transform
}
