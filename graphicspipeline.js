class GP {
	constructor(width, height, vram){
		this.buffer = vram;
		this.size = vram.length;
		this.canvas = document.createElement("canvas")
		this.canvas.width = width;
		this.canvas.height = height;
		this.ctx = this.canvas.getContext("2d")
		this.pal = ["#00303b","#ff7777","#ffce96","#f1f2da"]

	}


	render(ctx) {
		//console.log(this.buffer)
		for (var i = 0; i < this.size; i++) {
			this.ctx.fillStyle = this.pal[this.buffer[i]]
			//console.log(this.pal[this.buffer[i]])
			this.ctx.fillRect((i%this.width), Math.floor(i/this.height),2,2)
		}
	}

}