(() => {
  let uuid = function() {
    //replace with actual uuid4 implementation
    let random = '' + Math.random()
    return random
  }

  let store = function(name, data) {
    return localStorage.setItem(name, JSON.stringify(data))
  }

  let retrieve = function(name) {
    let storedData = localStorage.getItem(name)
    return JSON.parse(storedData) || []
  }

  let util = {
    uuid: uuid,
    store: store,
    retrieve: retrieve
  }

  window.util = util
})()