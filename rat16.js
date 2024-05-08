let wk;
class Rat16 {
	constructor(canvas, cartdata){

		if(cartdata instanceof String){
			this.data = JSON.parse(cartdata)
		}else if (cartdata instanceof Object){
			this.data = cartdata
		}else {
			throw new Error("Cart data should be a string or object")
		}

		this.width = 100;
		this.height = 100;
		this.scale = 4;

		this.ssW = 160
		this.ssH = 160
		this.vramsize = (this.width*this.height)
		this.sssize = 4096
		this.fssize = 4096
		this.keysize = 11
		this.freesize = 1000797

		this.keys = [0,0,0,0,0,0,0,0,0,0,0]

		canvas.addEventListener("mousemove", (e)=>{
			let rect = e.target.getBoundingClientRect();
			let x = e.clientX - rect.left
			let y = e.clientY - rect.top
			if (x < 0) {
				x = 0
			}
			if(y < 0){
				y = 0
			}
			this.keys[8] = Math.floor(x/this.scale); 
			this.keys[9] = Math.floor(y/this.scale);  
			      
		})

		canvas.addEventListener("mousedown", (e)=>{
			this.keys[10] = 1

		})

		canvas.addEventListener("mouseup", (e)=>{
			this.keys[10] = 0
		})

		document.body.addEventListener("keydown", (e)=> {
	
			if (e.key == "ArrowUp") {
				this.keys[0] = 1
			}
			if (e.key == "ArrowDown") {
				this.keys[1] = 1
			}
			if (e.key == "ArrowLeft") {
				this.keys[2] = 1
			}
			if (e.key == "ArrowRight") {
				this.keys[3] = 1
			}
			if (e.key == "z") {
				this.keys[4] = 1
			}
			if (e.key == "x") {
				this.keys[5] = 1
			}
			if (e.key == "a") {
				this.keys[6] = 1
			}
			if (e.key == "s") {
				this.keys[7] = 1
			}})
		document.body.addEventListener("keyup", (e)=> {
	
			if (e.key == "ArrowUp") {
				this.keys[0] = 0
			}
			if (e.key == "ArrowDown") {
				this.keys[1] = 0
			}
			if (e.key == "ArrowLeft") {
				this.keys[2] = 0
			}
			if (e.key == "ArrowRight") {
				this.keys[3] = 0
			}
			if (e.key == "z") {
				this.keys[4] = 0
			}
			if (e.key == "x") {
				this.keys[5] = 0
			}
			if (e.key == "a") {
				this.keys[6] = 0
			}
			if (e.key == "s") {
				this.keys[7] = 0
			}})


		this.canvas = canvas
		this.canvas.width = this.width * this.scale
		this.canvas.height = this.height * this.scale
		this.canvas.style = `width: ${this.width * this.scale}px;height: ${this.height * this.scale}px;cursor:none;`
		this.ctx = canvas.getContext("2d")
		this.ctx.imageSmoothingEnabled= false

		this.backBuffer = document.createElement("canvas")
		this.backBuffer.width = this.width
		this.backBuffer.height = this.height

		wk = new Worker("renderthread.js")
		let os = this.backBuffer.transferControlToOffscreen()
		wk.postMessage({canvas:os},[os])
		
		this.MM = new MemoryMap();

		this.Vram = new Ram(this.vramsize)
		this.Spritesheet = new Ram(this.sssize)
		this.Fontsheet = new Rom(this.fssize)
		this.KeyMem = new Rom(this.keysize)
		this.FreeMem = new Ram(this.freesize)

		this.MM.map(this.Vram,0,this.vramsize)
		this.MM.map(this.Spritesheet,this.vramsize,this.vramsize+this.sssize)
		this.MM.map(this.Fontsheet,this.vramsize+this.sssize,this.vramsize+this.sssize+this.fssize)
		this.MM.map(this.KeyMem,this.vramsize+this.sssize+this.fssize,this.vramsize+this.sssize+this.fssize+this.keysize)
		this.MM.map(this.FreeMem,this.vramsize+this.sssize+this.fssize+this.keysize,this.vramsize+this.sssize+this.fssize+this.keysize+this.freesize)

		console.log(((this.vramsize+this.sssize+this.fssize+this.keysize+this.freesize)/1000) + " kb")

		this.regions = Object.freeze({
			SPRITE: this.vramsize,
			FONT: this.vramsize+this.sssize,
			KEYS: this.vramsize+this.sssize+this.fssize,
			RAM: this.vramsize+this.sssize+this.fssize+this.keysize
		})
		this.gpu = new GPU(this.MM, this.width, this.height, this.regions)

		


		/*if (this.data.code) {
			
				
			
			if(this.data.code instanceof String){
				this.update = Function(this.data.code+"\nreturn update;").bind(this)()
			}else if(this.data.code instanceof Function){
				this.update = this.data.code.bind(this)()
			}
			
		}else {
			this.update = () => {
				
			}
		}

		if (this.data.sprites) {
			this.Spritesheet.load(this.data.sprites)
		}*/
		this.cur = false
		let l = 0;
		let r = 0;

		this.update = () => {
			//this.gpu.clr()
			if (l>8) {
				l = 0
				r++
			}
			if(r>8){
				r = 0
			}
			
			for (var i = 0; i < 8; i++) {
				this.gpu.pset(l,r,Math.floor(Math.random()*3))
			}

			for (var i = 0; i < 8; i++) {
				this.gpu.pset(l+(11*8)+3,r,Math.floor(Math.random()*3))
			}

			for (var i = 0; i < 8; i++) {
				this.gpu.pset(l+(11*8)+3,r+(11*8)+3,Math.floor(Math.random()*3))
			}

			for (var i = 0; i < 8; i++) {
				this.gpu.pset(l,r+(11*8)+3,Math.floor(Math.random()*3))
			}

			this.gpu.text("Rat16",50-20,50-4, 1)
			

			l++
			
		}

		
		

		

		
		let fnt = [

		//0
		0,1,1,1,0,0,0,0,
		1,0,0,0,1,0,0,0,
		1,1,0,0,1,0,0,0,
		1,0,1,0,1,0,0,0,
		1,0,0,1,1,0,0,0,
		1,0,0,0,1,0,0,0,
		0,1,1,1,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//1
		0,0,1,0,0,0,0,0,
		0,1,1,0,0,0,0,0,
		1,0,1,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		1,1,1,1,1,0,0,0,
		0,0,0,0,0,0,0,0,

		//2
		0,0,1,0,0,0,0,0,
		0,1,0,1,0,0,0,0,
		1,0,0,0,1,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		1,1,1,1,1,0,0,0,
		0,0,0,0,0,0,0,0,

		//3
		1,1,1,1,0,0,0,0,
		0,0,0,0,1,0,0,0,
		0,0,0,0,1,0,0,0,
		1,1,1,1,0,0,0,0,
		0,0,0,0,1,0,0,0,
		0,0,0,0,1,0,0,0,
		1,1,1,1,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//4
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		0,1,1,1,1,0,0,0,
		0,0,0,0,1,0,0,0,
		0,0,0,0,1,0,0,0,
		0,0,0,0,1,0,0,0,
		0,0,0,0,0,0,0,0,

		//5
		1,1,1,1,1,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		0,1,1,1,0,0,0,0,
		0,0,0,0,1,0,0,0,
		0,0,0,0,1,0,0,0,
		1,1,1,1,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//6
		0,1,1,1,1,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		1,1,1,1,0,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		0,1,1,1,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//7
		1,1,1,1,1,0,0,0,
		0,0,0,0,0,1,0,0,
		0,0,0,0,1,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//8
		0,1,1,1,0,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		0,1,1,1,0,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		0,1,1,1,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//9
		0,1,1,1,0,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		0,1,1,1,1,0,0,0,
		0,0,0,0,1,0,0,0,
		0,0,0,0,1,0,0,0,
		1,1,1,1,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//a
		0,1,1,1,0,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,1,1,1,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		0,0,0,0,0,0,0,0,

		//b
		1,1,1,1,0,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,1,1,1,0,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,1,1,1,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//c
		0,1,1,1,1,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		0,1,1,1,1,0,0,0,
		0,0,0,0,0,0,0,0,

		//d
		1,1,1,1,0,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,1,1,1,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//e
		0,1,1,1,1,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		1,1,1,1,1,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		0,1,1,1,1,0,0,0,
		0,0,0,0,0,0,0,0,

		//f
		0,1,1,1,1,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		1,1,1,1,1,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//g
		0,1,1,1,1,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,1,1,0,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		0,1,1,1,1,0,0,0,
		0,0,0,0,0,0,0,0,

		//h
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,1,1,1,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		0,0,0,0,0,0,0,0,

		//i
		1,1,1,1,1,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		1,1,1,1,1,0,0,0,
		0,0,0,0,0,0,0,0,

		//j
		1,1,1,1,1,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		1,1,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//k
		1,0,0,0,1,0,0,0,
		1,0,0,1,0,0,0,0,
		1,0,1,0,0,0,0,0,
		1,1,0,0,0,0,0,0,
		1,0,1,0,0,0,0,0,
		1,0,0,1,0,0,0,0,
		1,0,0,0,1,0,0,0,
		0,0,0,0,0,0,0,0,

		//l
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		0,1,1,1,1,0,0,0,
		0,0,0,0,0,0,0,0,

		//m
		1,0,0,0,1,0,0,0,
		1,1,0,1,1,0,0,0,
		1,0,1,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		0,0,0,0,0,0,0,0,

		//n
		1,0,0,0,1,0,0,0,
		1,1,0,0,1,0,0,0,
		1,1,1,0,1,0,0,0,
		1,0,1,0,1,0,0,0,
		1,0,0,1,1,0,0,0,
		1,0,0,1,1,0,0,0,
		1,0,0,0,1,0,0,0,
		0,0,0,0,0,0,0,0,

		//o
		0,1,1,1,0,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		0,1,1,1,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//p
		0,1,1,1,0,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,1,1,1,0,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//q

		0,1,1,1,0,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		0,1,1,1,0,0,0,0,
		0,0,0,0,1,0,0,0,
		0,0,0,0,0,0,0,0,

		//r
		1,1,1,1,0,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,1,1,1,0,0,0,0,
		1,0,1,0,0,0,0,0,
		1,0,0,1,0,0,0,0,
		1,0,0,0,1,0,0,0,
		0,0,0,0,0,0,0,0,

		//s
		0,1,1,1,1,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		0,1,1,1,0,0,0,0,
		0,0,0,0,1,0,0,0,
		0,0,0,0,1,0,0,0,
		1,1,1,1,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//t
		1,1,1,1,1,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//u
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		0,1,1,1,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//v
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		0,1,0,1,0,0,0,0,
		0,1,0,1,0,0,0,0,
		0,1,0,1,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//w
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		1,0,1,0,1,0,0,0,
		1,0,1,0,1,0,0,0,
		1,0,1,0,1,0,0,0,
		1,0,1,0,1,0,0,0,
		0,1,1,1,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//x
		1,0,0,0,1,0,0,0,
		0,1,0,1,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,1,0,1,0,0,0,0,
		1,0,0,0,1,0,0,0,
		0,0,0,0,0,0,0,0,

		//y
		1,0,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		0,1,0,1,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//z
		1,1,1,1,1,0,0,0,
		0,0,0,0,1,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		1,1,1,1,1,0,0,0,
		0,0,0,0,0,0,0,0,

		//cursor
		1,1,1,1,1,0,0,0,
		1,1,0,0,0,0,0,0,
		1,0,1,0,0,0,0,0,
		1,0,0,1,0,0,0,0,
		1,0,0,0,1,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//whitespace
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//period
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//colon
		0,0,0,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//open paren
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,1,1,0,
		0,0,0,0,1,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,0,1,0,0,0,
		0,0,0,0,0,1,1,0,
		0,0,0,0,0,0,0,0,

		//close paren
		0,0,0,0,0,0,0,0,
		0,1,1,0,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,0,1,0,0,0,
		0,0,0,0,1,0,0,0,
		0,0,0,1,0,0,0,0,
		0,1,1,0,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//!

		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//?

		1,0,0,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,

		//:/

		0,1,1,1,1,1,1,0,
		1,0,0,0,0,0,0,1,
		1,0,1,0,0,1,0,1,
		1,0,0,0,0,0,0,1,
		1,0,1,1,1,1,0,1,
		1,0,0,0,0,0,0,1,
		0,1,1,1,1,1,1,0,
		0,0,0,0,0,0,0,0,



		]

		this.Fontsheet.load(fnt)
		





	

		this.runcode = () => {
			let regions = this.regions
			let btn = (b) => {
				if ((b <= 7)  && (b >= 0)) {
					return this.MM.get(regions.KEYS+b) == 1
				}else {
					return this.MM.get(regions.KEYS+7) == 1
				}
			}
			let mbtn = () => {
				
				return this.MM.get(regions.KEYS+10) == 1
				
			}

			let mouse = (a) => {
				if((a <= 1) && (a >= 0)){
					return this.MM.get(regions.KEYS+(8+a))
				}else {
					return this.MM.get(regions.KEYS+(9))
				}
			}

			let peek = (a) => {
				return this.MM.get(a)
			}

			let poke = (a, v) => {
				this.MM.set(a, v)
			}

			let char = (c,x,y,clr) => {
				this.gpu.char(c,x,y,clr)
			}
			let text = (t,x,y,clr,len=11) => {
				this.gpu.text(t,x,y,clr,len)
			}

			let spr = (s,x,y) => {
				this.gpu.spr(s,x,y)
			}

			let pget = (x,y) => {
				this.gpu.pget(x,y)
			}
			let pset = (x,y,c) => {
				this.gpu.pset(x,y,c)
			}

			let line = (x1,y1,x2,y2,c) => {
				this.gpu.line(x1,y1,x2,y2,c)
			}
			let rect = (x,y,w,h,c) => {
				this.gpu.rect(x,y,w,h,c)
			}

			let clr = () => {
				this.gpu.clr()
			}


			
			return {
				clr: clr,
				pset: pset,
				pget: pget,
				char: char,
				text: text,
				spr: spr,
				line: line,
				rect: rect,
				btn: btn,
				mbtn: mbtn,
				mouse: mouse,
				peek: peek,
				poke: poke,
				regions: this.regions

			}
			
		}

		this.run = () => {


			

			
			let obj = this.runcode()
			
			if(wk){
				wk.postMessage({event:"draw",vram:this.Vram.buffer,width:this.width,height:this.height})

			}
			this.ctx.drawImage(this.backBuffer,0,0,this.width*this.scale,this.height*this.scale)
			this.KeyMem.load(this.keys)
			try{
				this.update.bind(obj)()
			}catch(err){
				this.gpu.clr()
				this.gpu.text(err+"\n\npress a (z) to\nrestart",0,0,1)
				//console.error(err)
				if(obj.btn(4)){
					this.load(this.data)
				}
			}
			

			let mx = this.MM.get(this.regions.KEYS+8)
			let my = this.MM.get(this.regions.KEYS+9)
			if(this.cur){
				this.gpu.char(36, mx,my,2)
			}
			
			window.requestAnimationFrame(this.run)
		}

		this.load = (d) => {
			this.gpu.clr()
			this.cur = true
			if(typeof d === 'string' || d instanceof String){
				this.data = JSON.parse(d)
			}else if (d instanceof Object){
				this.data = d
			}else {
				throw new Error("Cart data should be a string or object")
			}
			console.log(this.data)

			if (this.data.code) {
				console.log(typeof this.data.code === 'string')
				if(typeof this.data.code === 'string' || this.data.code instanceof String){
					this.update = Function(this.data.code+"\nreturn update;").bind(this)()
					console.log(this.update)
				}else if(this.data.code instanceof Function){
					this.update = this.data.code.bind(this)()
				}
			
			}else {
				this.update = () => {
					
				}
			}

			if (this.data.sprites) {
				this.Spritesheet.load(this.data.sprites)
			}


		}

		setTimeout(() => {
			this.load(this.data)
		}, 4000);

		
	}
}