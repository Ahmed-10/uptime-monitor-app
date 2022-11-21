/* 
 * Primary file for the API 
 *
 */

// Dependencies
const http = require('node:http')
const url = require('node:url')
const { StringDecoder } = require('node:string_decoder')
const config = require('./config')


// error handler
function responseErrorHandler(res, code, description) {
	res.writeHead(code, {'content-type': 'application/json'})
	return JSON.stringify({
		description,
		code,
		name: http.STATUS_CODES[code]
	})
}

function responseHandler(res, code, payload) {
	res.writeHead(code, {'content-type': 'application/json'})
	return JSON.stringify({...payload})	
}

// the server response to API requests
const server = http.createServer(function(req, res){
	const parsedUrl = url.parse(req.url, true)
	// cleaning pathname from prefixed and postfixed slashes
	const trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, '')
	const httpMethod = req.method.toUpperCase()

	// parsing request body
	const decoder = new StringDecoder('utf8')
	let buffer = ''
	req.on('data', function(data){
		buffer += decoder.write(data)
	})

	// handle response
	req.on('end', function(){
		buffer += decoder.end()
		const data = {
			...req, 
			path: trimmedPath, 
			queryString: Object.assign({}, parsedUrl.query), 
			method: req.method.toUpperCase(),
			payload: buffer,
		}
		const handler = handlers[trimmedPath] ?? handlers.notFound		
		handler(data, res)
	})
})


const handlers = {}

handlers.sample = function(req, res) {
	res.end(responseHandler(res, 200, {name: 'sample handler'}))
}

handlers.notFound = function(req, res) {
	res.end(responseErrorHandler(res, 404))
}

const router = {
	'sample': handlers.sample
}


// start the server, listening to port passed by configuration
const { port, env } = config
server.listen(port, function(){
	console.log(`the ${env} server is started and listening to port ${port}`)
})