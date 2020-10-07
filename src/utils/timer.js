let timer = null

export function createInterval(fn, wait){
	timer = setTimeout(()=>{
		fn()
		createInterval(fn, wait)
	}, wait)
}

export function cancelInterval(){
	clearTimeout(timer)
}