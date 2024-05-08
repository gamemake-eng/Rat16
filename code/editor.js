class Editor {
	constructor(d) {
		this.editor = ace.edit(d)
		this.editor.setTheme("ace/theme/monokai")
		this.editor.session.setMode("ace/mode/javascript")

	}

	load(d) {
		this.editor.setValue(d.code)
	}

	store(d){
		d.code = this.editor.getValue()
	}
}