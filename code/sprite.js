class SpriteEditor {
	constructor(id) {
		this.scale = 8
		this.parent = document.getElementById(id)
		this.canvas = document.createElement("canvas")
		this.canvas.width = 8 * this.scale
		this.canvas.height = 8 * this.scale

		this.mouse = {x:0, y:0,down:false}
		

		this.canvas.addEventListener("mousemove", (e)=>{
			let rect = e.target.getBoundingClientRect();
			let x = e.clientX - rect.left
			let y = e.clientY - rect.top
			if (x < 0) {
				x = 0
			}
			if(y < 0){
				y = 0
			}
			if (x > this.canvas.width) {
				x = canvas.width
			}
			if(y > this.canvas.height){
				y = canvas.height
			}
			this.mouse.x = x;
			this.mouse.y = y;  
			      
		})

		this.canvas.addEventListener("mousedown", (e)=>{
		
			this.mouse.down = true;
			      
		})

		this.canvas.addEventListener("mouseup", (e)=>{
			
			this.mouse.down = false;
			      
		})


		this.ctx = this.canvas.getContext("2d")
		this.sprites =  []
		this.dropdown = document.createElement("select")

		this.color = document.createElement("select")

		for (var i = 0; i < 4; i++) {
			let opt = document.createElement("option")
			opt.value = i
			opt.innerHTML = "Color: "+i
			this.color.appendChild(opt)
		}

		for (var i = 0; i < 64; i++) {
			this.sprites.push([
				0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0
			])

			let opt = document.createElement("option")
			opt.value = i
			opt.innerHTML = "Sprite: "+i
			this.dropdown.appendChild(opt)
		}

		this.parent.appendChild(this.canvas)
		let div = document.createElement("div")
		div.appendChild(this.dropdown)
		div.appendChild(this.color)
		this.parent.appendChild(div)

		let update = () => {
			let pallete = [[0x00,0x30,0x3b],[0xff,0x77,0x77],[0xff,0xce,0x96],[0xf1,0xf2,0xda]]
		
			this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
			
			let currentspr = this.sprites[this.dropdown.value]

			for (var i = 0; i < currentspr.length; i++) {
				this.ctx.fillStyle = `rgb(${pallete[currentspr[i]].join()})`
				this.ctx.lineWidth = 0
				this.ctx.fillRect((i%8)*this.scale, Math.floor(i/8)*this.scale,this.scale,this.scale)
			}

			this.ctx.fillStyle = `rgb(${pallete[this.color.value].join()})`
			this.ctx.strokeStyle = `rgb(0,0,0)`
			this.ctx.lineWidth = 2

			this.ctx.beginPath()
			this.ctx.rect(Math.floor(this.mouse.x/this.scale)*this.scale,Math.floor(this.mouse.y/this.scale)*this.scale,this.scale,this.scale)
			this.ctx.fillRect(Math.floor(this.mouse.x/this.scale)*this.scale,Math.floor(this.mouse.y/this.scale)*this.scale,this.scale,this.scale)
			this.ctx.stroke()

			if(this.mouse.down){
				let x = Math.floor(this.mouse.x/this.scale)
				let y = Math.floor(this.mouse.y/this.scale)
				currentspr[x + 8 * y] = this.color.value
			}
			window.requestAnimationFrame(update)
		}

		update()
	}

	load(data) {
		for (var i = 0; i < data.sprites.length; i++) {
			this.sprites[i] = data.sprites[i]
		}
	}

	store(data) {
		for (var i = 0; i < this.sprites.length; i++) {
			data.sprites[i] = this.sprites[i]
		}
	}
}