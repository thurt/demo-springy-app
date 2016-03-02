function createLog(el) {
  function log(msg, opts) {
    log.el.innerHTML = ''
    log.transformer(msg, opts)
  }
  log.transformer = createTransformer({
    'label': function (type) {
      var label = document.createElement('i')
      label.classList.add('icon')
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
      log.el.appendChild(label)

      var span = document.createElement('span')
      span.classList.add('message')
      span.textContent = this
      log.el.appendChild(span)
    }
  })
  log.el = el
  return log
}