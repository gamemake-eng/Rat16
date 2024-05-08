let test = [

		0,1,1,0,0,1,1,0,
		0,1,1,0,0,1,1,0,
		0,1,1,0,0,1,1,0,
		0,1,1,0,0,1,1,0,
		0,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,1,
		1,0,0,0,0,0,0,1,
		1,1,1,1,1,1,1,1,

		0,1,1,0,0,1,1,0,
		0,1,1,0,0,1,1,0,
		0,1,1,0,0,1,1,0,
		0,1,1,0,0,1,1,0,
		0,0,0,0,0,0,0,0,
		1,1,1,1,1,1,1,1,
		1,0,0,0,0,0,0,1,
		1,1,1,1,1,1,1,1,

		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0

]

let data2 = {
	sprites: test,
	code: () => {
		let key = "Press a key"
		function update() {
			this.clr()

			this.text(key,50-((key.length*8)/2),50-4,2)


			if(this.btn(0)){
				key = "up:0"
			}
			if(this.btn(1)){
				key = "down:1"
			}
			if(this.btn(2)){
				key = "left:2"
			}
			if(this.btn(3)){
				key = "right:3"
			}

			if(this.btn(4)){
				key = "a:4"
			}
			if(this.btn(5)){
				key = "b:5"
			}

			if(this.btn(6)){
				key = "start:6"
			}
			if(this.btn(7)){
				key = "select:7"
			}


		}

		return update
	}
}


let olddata = {
		sprites: test,
		code: () => {

			let newdragable = (x,y,w,h,o={},onclick=(e)=>{}) => {
				let fd = {
					x:x,y:y,w:w,h:h,clicks:0,
					onclick:function(e){
						
						this.initx = e.mouse.x - this.x
						this.inity = e.mouse.y - this.y
						this.clicks+= 1
						if(this.clicks >=3){
							this.clicks = 0
						}
						onclick(e)
					},
					ondown:function(e) {
						
						this.x = e.mouse.x - this.initx
						this.y = e.mouse.y - this.inity
					},
					options: o
					

				}
				return fd
			}
			let btn = [
				newdragable(0,0,10,10,{spr:0})
			]
			for (var i = 0; i < 10; i++) {
				btn.push(newdragable( Math.floor(Math.random()*(100-8)), Math.floor(Math.random()*(100-8)), 15,15, {spr:0 }))
			}
			let mx = 0;
			let my = 0;
			function pointinrect(x,y,r){
				let t1 = (x >= r.x) && (x <= (r.x + r.w))
				let t2 = (y >= r.y) && (y <= (r.y + r.h))
				return t1 && t2
			}
			function update() {
				this.clr()
				mx = this.mouse(0)
				my = this.mouse(1)
				
				for(let i in btn){
					let v = btn[i]
					if(pointinrect(mx,my,v)){
						if (this.mbtn()) {
							if (!v.hasclicked && v.onclick) {
								v.onclick.bind(v)({mouse:{x:mx, y:my}})
								v.hasclicked = true
							}

							if(v.ondown){
								v.ondown.bind(v)({mouse:{x:mx, y:my}})
							}
							
							
							
						}else {
							v.hasclicked = false
							
						}

						//this.rect(v.x, v.y, v.w, v.h, 1)
						
							
						
						
					}else {
						//this.rect(v.x, v.y, v.w, v.h , 2)
					}
					this.spr(v.options.spr,v.x,v.y)
				}

				this.text("drag and\ndrop!", 0,0, 3)
				
			}
			return update
		}
}

let data = {
	sprites: test,
	code: () => {
		let key = "No Cart!\n\nLoad one\nbelow!"
		function update() {
			this.clr()
			let txt = key.split("\n")
			for (var i = 0; i < txt.length; i++) {
				let v = txt[i]
				this.text(v,50-((v.length*8)/2),(50-4)+(i*8),2)
			}
			
		}

			

		return update
	}
}

let ld = document.getElementById("load");
let loaddialg = document.getElementById("loadd");
ld.addEventListener("click", (event)=>{
	loaddialg.click()
})
loaddialg.addEventListener("change", function(event){
	let file = this.files[0]
	if(file)
	{
		const r = new FileReader()
		r.onload = (e) =>{
			let data = e.target.result
			
			window.location = "./?data="+btoa(data)
		}
		r.readAsText(file)
	}
})




let params = new URLSearchParams(window.location.search)

if (params.get("data")) {
	let jsn;
	try{
		jsn = JSON.parse(atob(params.get("data").replace(/ /g, "+")))
		data = jsn
		
	}catch(err){
		alert(`Could not load:\n${err}`)
		throw new Error(err)
	}

}

let vm = new Rat16(document.getElementById("main"), data)
vm.run()


