let ctx;
let canvas;
onmessage = (e) => {
	if (e.data.canvas) {
		ctx = e.data.canvas.getContext("2d")
		ctx.imageSmoothingEnabled= false
		canvas = e.data.canvas
		console.log(ctx)

	}else {
		
		
	
		let pal = [[0x00,0x30,0x3b],[0xff,0x77,0x77],[0xff,0xce,0x96],[0xf1,0xf2,0xda]]
		ctx.fillStyle = `rgb(${pal[0].join()})`
		ctx.fillRect(0,0,e.data.width, e.data.height)
		/*for (var i = 0; i < e.data.vram.length; i++) {
			if(e.data.vram[i] > 0){
				ctx.fillStyle = `rgb(${pal[e.data.vram[i]].join()})`

				ctx.fillRect((i%e.data.width), Math.floor(i/e.data.height),1,1)
			}
			
		}*/

		for (var i = e.data.vram.length - 1; i >= 0; i--) {
			if(e.data.vram[i] > 0){
				ctx.fillStyle = `rgb(${pal[e.data.vram[i]].join()})`

				ctx.fillRect((i%e.data.width), Math.floor(i/e.data.height),1,1)
			}
		}

		
	}
		
}