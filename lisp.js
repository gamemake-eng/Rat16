const TokenTypes ={
	LeftBracket: "LB",
	RightBracket: "RB",
	String: "STR",
	Keyword: "KEY",
	Number: "NUM",
	Boolean: "BOOL",
	Eof: "EOF"
}

class Token{
	constructor(tokentype, lexeme, literal){
		this.type = tokentype
		this.lexme = lexeme
		this.literal = literal
	}
}

class Scan {
	constructor(src){
		this.source = src
		this.start = 0
		this.current = 0
		this.tokens = []
	}

	scan() {
		while(!(this.current >= this.source.length)){
			this.start = this.current

			let char = this.source[this.current++]

			switch(char) {
				case "(":
					this.addToken(TokenTypes.LeftBracket)
					break;
				case ")":
					this.addToken(TokenTypes.RightBracket)
					break;
				case " ":
					
				case "\r":
					
				case "\t":
					
				case "\n":
					break;
				case "#":
					if(this.source[this.current] === "t"){
						this.current++
						this.addToken(TokenTypes.Boolean, true)
						break
					}else if(this.source[this.current] === "f"){
						this.current++
						this.addToken(TokenTypes.Boolean, false)
						break
					}
				case '"':
					while(this.source[this.current] !== '"' && !(this.current >= this.source.length)){
						this.current++
					}
					const lit = this.source.slice(this.start+1, this.current)
					this.addToken(TokenTypes.String, lit)
					this.current++
					break;
				default:
					let digit = char >= "0" && char <= "9"
					let dot = char === "."

					let operations = "+-.*/<>=!?:$%_&~^"
					let keyword = (digit || dot) || (char >= "A" && char <= "Z") || (char >= "a" && char <= "z") || operations.includes(char)
					if (this.isDigit(char)) {
						while(this.isDigitOrDot(this.source[this.current])){
							this.current++
						}
						const numasstr = this.source.slice(this.start,this.current)

						this.addToken(TokenTypes.Number,parseFloat(numasstr))
						break
					}else if(this.isKeyword(char)){
						while(this.isKeyword(this.source[this.current])){
							this.current++
						}
						
						this.addToken(TokenTypes.Keyword)
						break
					}else {
						throw new SyntaxError(`Unknown token ${char}`)
						break
					}
			}
		}

		this.tokens.push(new Token(TokenTypes.Eof,'',null))
		return this.tokens
	}

	isDigit(char){
		let digit = char >= "0" && char <= "9"
		return digit
	}

	isDigitOrDot(char){
		return this.isDigit(char) || char === "."
	}

	isKeyword(char){

		let operations = "+-.*/<>=!?:$%_&~^"
		let keyword = this.isDigitOrDot(char) || (char >= "A" && char <= "Z") || (char >= "a" && char <= "z") || operations.includes(char)
		return keyword
	}

	addToken(type, lit){
		const lexeme = this.source.slice(this.start, this.current)
		this.tokens.push(new Token(type,lexeme,lit))
	}
}

class CallExpr {
	constructor(calle, args){
		this.calle = calle
		this.args = args
	}
}

class SymbolExpr {
	constructor(tok){
		this.token = tok
	}
}

class LiteralExpr {
	constructor(val){
		this.value = val
	}
}

class IfExpr {
	constructor(test, outcome, alter){
		this.test = test
		this.consequent = outcome
		this.alternative = alter
	}
}

class DefExpr {
	constructor(name,value){
		this.value = value
		this.name = name
	}
}
class LocaldefExpr {
	constructor(bindings,body){
		this.bindings = bindings
		this.body = body
	}
}
class SetExpr {
	constructor(name,value){
		this.value = value
		this.name = name
	}
}

class FuncExpr {
	constructor(params, body){
		this.params = params
		this.body = body
	}
}

class LocaldefNode {
	constructor(name,value){
		this.name = name
		this.value = value
	}
}

class Parser {
	constructor(tokens){
		this.tokens = tokens
		this.current = 0
	}

	parse() {
		const expr = []
		while (!(this.tokens[this.current].type === TokenTypes.Eof)){
			let expression = this.expression();
			expr.push(expression)
			
		}
		return expr
	}

	expression(){
		if(this.match(TokenTypes.LeftBracket)){
			if(this.match(TokenTypes.RightBracket)){
				return new LiteralExpr([])
			}

			const tok = this.tokens[this.current]
			
			if(tok.lexme === "if"){
				return this.if()
			}
			if(tok.lexme === "def"){
				return this.def()
			}
			if(tok.lexme === "set!"){
				return this.set()
			}
			if(tok.lexme === "localdef"){
				return this.localdef()
			}
			if(tok.lexme === "func"){
				return this.func()
			}

			return this.call()
		}
		return this.atom()
	}
	consume(tok){

		if(this.check(tok)){
			return this.advance()
			
		}
		console.log(tok,this.tokens[this.current-1].lexme )
		throw new SyntaxError(`Unexpected token ${this.tokens[this.current-1].lexme} at ${this.current-1}, expected ${tok}`)
		
		
	}

	advance(){
		if(!(this.tokens[this.current].type == "EOF")){
			this.current++
		}
		return this.tokens[this.current-1]
	}

	func() {
		this.advance()
		this.consume(TokenTypes.LeftBracket)
		const params = []
		while(!this.match(TokenTypes.RightBracket)){
			params.push(this.consume(TokenTypes.Keyword))
		}

		const body = []

		while(!this.match(TokenTypes.RightBracket)){
			body.push(this.expression())
		}
		return new FuncExpr(params,body)
	}

	def(){
		this.advance()
		const name = this.consume(TokenTypes.Keyword)
		console.log(name)
		const value = this.expression()
		this.consume(TokenTypes.RightBracket)
		return new DefExpr(name,value)
	}

	localbind() {
		this.consume(TokenTypes.LeftBracket)
		const name = this.consume(TokenTypes.Keyword)
		const value = this.expression()
		this.consume(TokenTypes.RightBracket)
		return new LocaldefNode(name,value)

	}

	localdef() {
		this.advance()
		this.consume(TokenTypes.LeftBracket)

		const bind = []

		while(!this.match(TokenTypes.RightBracket)){
			bindings.push(this.localbind())
		}

		const body = []

		while(!this.match(TokenTypes.RightBracket)){
			body.push(this.expression())
		}

		return new LocaldefExpr(bind, body)


	}
	set() {
		this.advance()
		const name = this.consume(TokenTypes.Keyword)
		const value = this.expression()
		this.consume(TokenTypes.RightBracket)
		return new SetExpr(name,value)
	}

	call() {
		let calle = this.expression()
		const args = []
		if(!this.match(TokenTypes.RightBracket)){
			args.push(this.expression())
		}
		return new CallExpr(calle, args)
	}

	if() {
		
		this.advance()
		
		
		
		const test = this.expression()

		let outcome = this.expression()
		let alter;

		if(!this.match(TokenTypes.RightBracket)){
			alter = this.expression()
			this.advance()
			
		}
		console.log(test, outcome, alter)
		this.consume(TokenTypes.RightBracket)
		return new IfExpr(test,outcome,alter)

	}

	atom(){
		switch(true){
		case this.match(TokenTypes.Keyword):
			return new SymbolExpr(this.tokens[this.current-1])
		case this.match(TokenTypes.Number):
		case this.match(TokenTypes.String):
		case this.match(TokenTypes.Boolean):
			return new LiteralExpr(this.tokens[this.current-1].literal)
		default:
			throw new SyntaxError(`Unexpected token ${this.tokens[this.current].lexme}`)
		}
	}

	match(t){
		if(this.check(t)){
			this.current++
			return true
		}
		return false
	}

	check(t) {

		return this.tokens[this.current].type === t
	}
}



class Env {
	constructor(params=[], args, enc){
		this.values = new Map();

		params.forEach((p,i)=>this.values.set(p.lexme,args[i]))

		this.enclosing = enc
	}

	def(name, val){
		this.values.set(name,value)
	}

	
	has(name) {
		if(this.values.has(name)){
			return this.values.has(name)
		}
		if(this.enclosing){
			return this.enclosing.has(name)
		}
		
	}


	set(name, value){
		if(this.values.has(name,value)){
			return this.values.set(name,value)
		}
		if(this.enclosing){
			return this.enclosing.set(name,value)
		}
		throw new Error(`${expr.name.lexme} is Undefined`)
		
	}

	get(name){
		if(this.values.has(name)){
			return this.values.get(name)
		}
		if(this.enclosing){
			return this.enclosing.get(name)
		}
		throw new Error(`${expr.name.lexme} is Undefined`)
		
	}
}
class FuncDef {
	constructor(dec, clo){
		//console.log(clo)
		this.declaration = dec
		this.closure = clo
	}
	call(inp, args){
		
		const env = new Env(this.declaration.params, args, this.closure)
		let res;
		
		for (const expr of this.declaration.body){
			res = inp.run(expr,env)
		}
		return res
	}
}

class VM {
	constructor(plugins={}){
		let env = {
				"*": ([a,b]) => a * b,
				"/": ([a,b]) => a / b,
				"-": ([a,b]) => a - b,
				"+": ([a,b]) => a + b,
				"=": ([a,b]) => a === b,
				">=": ([a,b]) => a >= b,
				"<=": ([a,b]) => a <= b,
				"%": ([a,b]) => a % b,
				"!": ([arg]) => !arg,
				"len": ([str]) => str.length,
				"append": ([a,b]) => a + b,
				"list": (args) => args,
				"null?": ([a]) => a === [],
				"list?": ([a]) => a instanceof Array,
				"number?": ([a]) => a instanceof Number,
				"func?": ([a]) => a instanceof Function,
				"car": ([a]) => a[0],
				"cdr": ([a]) => (a.length > 1 ? a.slice(1) : []),
				"cons": ([a,b]) => [a, ...b],
				"print": ([a]) => console.log(a),
		}
		for (let i in plugins) {
			env[i] = plugins[i]
		}
		this.env = new Map(
			Object.entries(env)
		)
	}

	runAll(expressions){
		let result;
		for(let expr of expressions){
			//console.log(expr)
			//console.log(this.env)
			result = this.run(expr, this.env)
		}
		return result
	}

	run(expr, env){
		while(true){
		
			if(expr instanceof LiteralExpr){
				return expr.value
			}

			if(expr instanceof SymbolExpr){
				//
				if(env.has(expr.token.lexme)){
					return env.get(expr.token.lexme)
				}
				//console.log(expr.token)
				
				throw new Error(`Unknown Keyword ${expr.token.lexme}`)
			}

			if(expr instanceof IfExpr){
				const test = this.run(expr.test, env)
				if(test !== false){
					return this.run(expr.consequent, env)
				}else {
					if(expr.alternative !== undefined)
					{
						return this.run(expr.alternative,env);
					}else {
						return;
					}
					
				}
				
			}		


			if(expr instanceof CallExpr){
				const calle = this.run(expr.calle, env)
				const args = expr.args.map((arg) => this.run(arg,env))
				if(calle instanceof FuncDef){
					const callenv = new Env(calle.declaration.params,args,calle.closure)
					for(const exprinbody of calle.declaration.body.slice(0,-1)){
						this.run(exprinbody,callenv)
					}
					expr = calle.declaration.body[calle.declaration.body.length-1]
					env = callenv
					continue;
					//return calle.call(this, args)
				}
				if(calle instanceof Function){
					return calle(args)
				}
				
				throw new Error(`Cannot call ${JSON.stringify(calle)}`)
			}

			if(expr instanceof DefExpr){
				const value = this.run(expr.value,env)
				env.set(expr.name.lexme, value)
				

				return;
			}

			if(expr instanceof LocaldefExpr){
				const names = expr.bindings.map((b)=>b.name)
				const values = expr.bindings.map((b)=>this.run(b.value, env))
				const letEnv = new Env(names,values,env)
				let res;
				for(const exprinbody of expr.body){
					res = this.run(exprinbody, letEnv)
				}
				return res;
			}

			if(expr instanceof FuncExpr){
				
				return new FuncDef(expr,env)


			}

			if(expr instanceof SetExpr){
				const value = this.run(expr.value,env)
				if(env.has(expr.name.lexme)){
					env.set(expr.name.lexme, value)
					return;
				}else {
					throw new Error(`${expr.name.lexme} is Undefined`)
				}
				
			}
		}
	}
}