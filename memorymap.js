class MemoryMap{
	constructor(){
		this.regions = []
	}
	map(d,s,e,remap=true){
		let r = {device:d,start:s,end:e,remap:remap};
		this.regions.unshift(r)

	}
	get(a){
		let d = this.regions.find(r => (a >= r.start) && (a <= r.end))

		let ra = d.remap ? a-d.start : a
		if(!d){
			throw new Error(`Cant find 0x${a}`)
		}
		return d.device.get(ra)
	}
	set(a,v){
		let d = this.regions.find(r => (a >= r.start) && (a <= r.end))
		if(isNaN(a)){
			console.log(d,a)
		}
		
		let ra = d.remap ? a-d.start : a
		if(!d){
			throw new Error(`Cant find 0x${a}`)
		}
		d.device.set(ra,v)
	}
}