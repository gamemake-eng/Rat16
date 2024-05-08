<p align="center">
  
  <img src="https://github.com/gamemake-eng/Rat16/assets/63882211/35daff9c-6414-433a-be4c-d050d563d0fb"/>
</p>

# NOTE: Don't use the one hosted on github pages, go [here](https://rat16console.pages.dev/) instead

#  Rat16: Yet another fantasy console

##  Specs
-  1 MB of free ram

-  100x100 screen

-  4 color pallete

-  ~4kb sprite ram (enough for 64 8x8 sprites)

-  ~4kb of font rom (A-Z, 0-9, cursor, some punctuation)

-  11 inputs (up, down, left, right, a, b, start, select, mouse button, mouse x/y)

-  Simple JS api

## API

```js
//Make sure you use the function keyword when defining update
function update() {
  this.peek(address) //Returns value of address
  this.poke(address, value) //Stores value at address
  this.regions //Contains a list of memory regions (SPRITE,FONT,KEYS,RAM)
  this.pget(x,y) //Returns color of pixel at x and y
  this.pset(x,y,c) //Sets pixel at x and y to c
  this.char(char, x, y, clr) //Draws a single charater at x and y with color clr
  this.text(text, x, y, clr) //Draws a multi-line string at x and y with color clr
  this.spr(s,x,y) //Draws sprite s (0-64) at x and y
  this.line(x1,y1,x2,y2,c) //Draws a line from x1 and y1 to x2 and y2 with color c
  this.rect(x,y,w,h,c) //Draws a rectangle at x and y with the dimenions of w and h with color c
  this.clr() //Clears the screen
  this.btn(b) //Checks if button (0-7) is down on "controler"
  this.mbtn() //Checks if mouse button is down
  this.mouse(a) //Returns the mouse position at axis a (0=x, 1=y)
}
```
