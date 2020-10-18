export default class Timer{
	constructor(){
		this.timer = null
	}
	
	createInterval(fn, wait){
		if(!this.timer){
			fn()
		}
		this.timer = setTimeout(()=>{
			this.createInterval(fn, wait)
			fn()
		}, wait)
	}
	
	cancelInterval(){
		clearTimeout(this.timer)
	}
}