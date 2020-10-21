function debounce(fn, wait){
  let timer = null
  return function(){
    if(timer){
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn()
    }, wait);
  }
}

function throttle(fn, wait) {
  let timer = null
  // fn()
  return function(...args){
    if(timer) return
    timer = setTimeout(() => {
      timer = null
      fn(args)
    }, wait);
  }
}

export {
  debounce,
  throttle
}