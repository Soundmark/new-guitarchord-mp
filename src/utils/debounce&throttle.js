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
  return function(){
    if(timer) return
    timer = setTimeout(() => {
      timer = null
      fn()
    }, wait);
  }
}

export {
  debounce,
  throttle
}