class Preview {
	constructor(d) {
		this.iframe = document.getElementById(d)
		this.scale = 4
		this.iframe.width = 100*this.scale
		this.iframe.height = 100*this.scale+5
		this.src = "../preview.html"
		this.iframe.src = this.src
	}

	load(d){
		let newdata = {sprites:[], code:``}

		newdata.code = d.code

		for (var i = 0; i < d.sprites.length; i++) {
			let v = d.sprites[i]
			for (var k = 0; k < v.length; k++) {
				newdata.sprites.push(parseInt(v[k]))
			}
		}

		this.iframe.src = this.src+"?data="+btoa(JSON.stringify(newdata))
		return newdata
	}
}