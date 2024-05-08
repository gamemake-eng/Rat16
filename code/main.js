let data = {
	sprites: [],
	code: `function update() {
		this.clr()
		this.text("Create\\nSomething!",0,0,2)
		this.spr(0,0,9*2)
	}`

}
for (var i = 0; i < 64; i++) {
	data.sprites.push([
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0

		])
}
data.sprites[0] = [
	1,0,0,0,0,0,0,1,
	1,0,0,0,0,0,0,1,
	1,0,0,0,0,0,0,1,
	1,0,0,0,0,0,0,1,
	0,0,0,0,0,0,0,0,
	1,0,0,0,0,0,0,1,
	1,0,0,0,0,0,0,1,
	1,1,1,1,1,1,1,1

	]


let e = new Editor("codeedit")
e.load(data)
let p = new Preview("preview")
p.load(data)
let se = new SpriteEditor("spriteedit")
se.load(data)




//DB stuff
let projname = ""
let db = new Dexie("Projects")

db.version(1).stores({
	projects: `
	name,
	data,
	lastsaved`
})

async function save_project(data) {
	let name;
	if (projname === "") {
		name = prompt("What will you name the project?")

		let nameindb = await db.projects.where("name").equals(name).toArray()
		let indb = nameindb.length >= 1

		if(!indb){
			projname=name
		}else {

			alert(`A projects is already named ${name}, pick a diffrent one`)
			projname = ""
		}
		
	}else{
		name = projname
	}
	let nameindb = await db.projects.where("name").equals(name).toArray()
	let indb = nameindb.length >= 1
	if(!indb){
		await db.projects.add({
			name: name,
			data: data,
			lastsaved: Date.now()
		})
	}else {
		await db.projects.toCollection().modify((i)=> {
			console.log(i)

			if (i.name === name) {
				i.data = data
				i.lastsaved = Date.now()
			}
		})
	}
	
}

async function get_projects() {
	return await db.projects.orderBy("lastsaved").toArray()
}

async function get_project(name) {
	let nameindb = await db.projects.where("name").equals(name).toArray()
	return nameindb[0]
}

let filepick = document.getElementById("loadfp")
filepick.addEventListener("change", function(event) {
	let file = this.files[0]
	if(file){
		projname = file.name.replace(".json","")
		const reader = new FileReader();
		reader.onload = (ee) => {
			let d = ee.target.result
			console.log(file)
			data = JSON.parse(d)
			e.load(data)
			se.load(data)
			p.load(data)
		}
		reader.readAsText(file);
	}
	
})

document.getElementById("run").addEventListener("click", (event)=>{
	
	e.store(data)
	se.store(data)
	p.load(data)
	save_project(data)
	
})
document.getElementById("save").addEventListener("click", (event)=>{
	e.store(data)
	se.store(data)
	save_project(data)

})

document.getElementById("loadfile").addEventListener("click", (event)=>{
	filepick.click()

})

document.getElementById("savefile").addEventListener("click", (event)=>{
	e.store(data)
	se.store(data)
	const blob = new Blob([JSON.stringify(data)], {type: "application/json"})
	const objurl = window.URL.createObjectURL(blob)

	const downloadLink = document.createElement("a")
	downloadLink.href = objurl
	downloadLink.download = `${projname}${Date.now()}.rat-project`

	downloadLink.click();

	window.URL.revokeObjectURL(objurl)

})
document.getElementById("export").addEventListener("click", (event)=>{
	console.log(p.load(data))
	const blob = new Blob([JSON.stringify(p.load(data))], {type: "application/json"})
	const objurl = window.URL.createObjectURL(blob)

	const downloadLink = document.createElement("a")
	downloadLink.href = objurl
	downloadLink.download = `${projname}${Date.now()}.json`

	downloadLink.click();

	window.URL.revokeObjectURL(objurl)

})
window.loadproj = (n) => {
	get_project(n).then((d) => {
		console.log(d)
		data = d.data
		e.load(data)
		se.load(data)
		p.load(data)
		projname = d.name
	})
}
document.getElementById("load").addEventListener("click", (event)=>{
	let win = window.open("./projects.html", "Select A Project", "popup,width=320,height=420")
	win.onload = () => {
		get_projects().then((d) => {
			for(let i in d){
				let v = d[i]
				win.document.getElementById("container").innerHTML+=`<button onclick="load('${v.name}')">${v.name}</button>`
			}
			

		})
	}
})
