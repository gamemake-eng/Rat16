class Ram {
	constructor(size){
		this.buffer = new Uint16Array(size)
	}
	get(a){
		return this.buffer[a]
	}
	set(a,v){
		this.buffer[a] = v
	}
	load(d){
		for (let i in d) {
			this.buffer[i] = d[i]
		}
	}
}
class Rom {
	constructor(size){
		this.buffer = new Uint16Array(size)
	}
	get(a){
		return this.buffer[a]
	}
	set(a,v){
		return 0;
	}
	load(d){
		for (let i in d) {
			this.buffer[i] = d[i]
		}
	}
}