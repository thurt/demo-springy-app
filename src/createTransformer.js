function createTransformer(methods) {
  if (typeof methods !== 'object') methods = {}

  function transform(target, methodsToCall) {
    for (var name in methodsToCall) {
      if (name in methods)
        target = methods[name].call(target, methodsToCall[name])
      else
        console.warn('This transformer does not support transform method ' + name)
    }
    return target
  }

  return transform
}
