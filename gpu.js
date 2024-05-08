class GPU {
	constructor(MM,width,height,reg){
		this.mmap = MM
		this.width = width
		this.height = height
		this.points = reg
	}

	pset(x,y,c){
		
		let fx = Math.floor(x)
		let fy = Math.floor(y)
		
		let pos = fy * this.width + fx


		
		
			if(( !( (fx > this.width-1) || (fx < 0) ) && !( (fy > this.height-1) || (fy < 0) ) ) ){
				this.mmap.set(pos, c)
			}
			if((fx == 0) && (fy == 0)){
				this.mmap.set(0, c)
			}
		
		
	}

	pget(x,y){
		let fx = Math.floor(x)
		let fy = Math.floor(y)
		let pos = fy * this.width + fx
		if (!(pos > (this.width*this.height))) {
			if(!( ((fx > this.width-1) || (fx < 0)) && ((fy > this.height-1) || (fy < 0)) ) ){
				return this.mmap.get(pos)
			}else{
				return 0
			}
		}else {
			return 0
		}
	}

	line(x1,y1,x2,y2,c){
		
		//copied from https://ghost-together.medium.com/how-to-code-your-first-algorithm-draw-a-line-ca121f9a1395
		//because i am lazy

		// Iterators, counters required by algorithm
	    let x, y, dx, dy, dx1, dy1, px, py, xe, ye, i;
	    // Calculate line deltas
	    dx = x2 - x1;
	    dy = y2 - y1;
	    // Create a positive copy of deltas (makes iterating easier)
	    dx1 = Math.abs(dx);
	    dy1 = Math.abs(dy);
	    // Calculate error intervals for both axis
	    px = 2 * dy1 - dx1;
	    py = 2 * dx1 - dy1;
	    // The line is X-axis dominant
	    if (dy1 <= dx1) {
	        // Line is drawn left to right
	        if (dx >= 0) {
	            x = x1; y = y1; xe = x2;
	        } else { // Line is drawn right to left (swap ends)
	            x = x2; y = y2; xe = x1;
	        }
	        this.pset(Math.floor(x), Math.floor(y),Math.floor(c)); // Draw first pixel
	        // Rasterize the line
	        for (i = 0; x < xe; i++) {
	            x = x + 1;
	            // Deal with octants...
	            if (px < 0) {
	                px = px + 2 * dy1;
	            } else {
	                if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
	                    y = y + 1;
	                } else {
	                    y = y - 1;
	                }
	                px = px + 2 * (dy1 - dx1);
	            }
	            // Draw pixel from line span at
	            // currently rasterized position
	            this.pset(Math.floor(x), Math.floor(y),Math.floor(c));
	        }
	    } else { // The line is Y-axis dominant
	        // Line is drawn bottom to top
	        if (dy >= 0) {
	            x = x1; y = y1; ye = y2;
	        } else { // Line is drawn top to bottom
	            x = x2; y = y2; ye = y1;
	        }
	        this.pset(Math.floor(x), Math.floor(y),Math.floor(c)); // Draw first pixel
	        // Rasterize the line
	        for (i = 0; y < ye; i++) {
	            y = y + 1;
	            // Deal with octants...
	            if (py <= 0) {
	                py = py + 2 * dx1;
	            } else {
	                if ((dx < 0 && dy<0) || (dx > 0 && dy > 0)) {
	                    x = x + 1;
	                } else {
	                    x = x - 1;
	                }
	                py = py + 2 * (dx1 - dy1);
	            }
	            // Draw pixel from line span at
	            // currently rasterized position
	            this.pset(Math.floor(x), Math.floor(y),Math.floor(c));
	        }
	    }
	}

	rect(x,y,w,h,c){
		let fx = Math.floor(x)
		let fy = Math.floor(y)
		let fw = Math.floor(w)
		let fh = Math.floor(h)

		this.line(fx,fy,fx+fw,fy,c);
		this.line(fx+fw,fy,fx+fw,fy+fh,c);
		this.line(fx+fw,fy+fh,fx,fy+fh,c);
		this.line(fx,fy+fh,fx,fy,c);
	}

	clr() {
		for (var x = 0; x < this.width*this.height; x++) {
			this.mmap.set(x,0)
			//this.pset((x%this.width)+x, Math.floor(x/this.height), 0)
		}
	}

	spr(s, x, y){
		
		let pos = this.points.SPRITE + (s*64)
		for (var i = 0; i < 64; i++) {
			let p = this.mmap.get(pos+i)
			if(p>0){
				this.pset((i%8)+Math.floor(x), Math.floor(i/8)+Math.floor(y), p)

			}
		}
	}

	char(c, x, y,clr){
		
		let pos = this.points.FONT + (c*64)
		for (var i = 0; i < 64; i++) {
			let p = this.mmap.get(pos+i)
			if(p==1){
				this.pset((i%8)+x, Math.floor(i/8)+y, p*clr)
			}
			
		}
	}

	text(t, x, y, clr,len=11){
		let char = {
			"0": 0,
			"1": 1,
			"2": 2,
			"3": 3,
			"4": 4,
			"5": 5,
			"6": 6,
			"7": 7,
			"8": 8,
			"9": 9,

			"a": 10,
			"b": 11,
			"c": 12,
			"d": 13,
			"e": 14,
			"f": 15,
			"g": 16,
			"h": 17,
			"i": 18,
			"j": 19,
			"k": 20,
			"l": 21,
			"m": 22,
			"n": 23,
			"o": 24,
			"p": 25,
			"q": 26,
			"r": 27,
			"s": 28,
			"t": 29,
			"u": 30,
			"v": 31,
			"w": 32,
			"x": 33,
			"y": 34,
			"z": 35,
			" ": 37,
			".": 38,
			":": 39,
			")": 41,
			"(": 40,
			"}": 41,
			"{": 40,
			"!": 42,
			"?": 43

		}
		let rt = t.toString().toLowerCase()
		let l = 0;
		let r = 0;
		for (var i = 0; i < rt.length; i++) {
			
			if(char[rt[i]] !== undefined){
				this.char(char[rt[i]],x+(r*8),y+(l*8),clr)
				r++
			}
			if((rt[i] == "\n") || (r>len)){
				r = 0;
				l++
			}

			


			
		}
	}
		
	
}

