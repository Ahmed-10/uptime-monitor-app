/* 
 * Primary file for the API 
 *
 */

// Dependencies
const http = require('node:http')
const url = require('node:url')
const { StringDecoder } = require('node:string_decoder')


// error handler
function responseErrorHandler(res, code, description) {
	res.writeHead(code, {'content-type': 'application/json'})
	return JSON.stringify({
		description,
		code,
		name: http.STATUS_CODES[code]
	})
}

// the server response to API requests
const server = http.createServer(function(req, res){
	const parsedUrl = url.parse(req.url, true)
	// cleaning pathname from prefixed and postfixed slashes
	const trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, '')
	const httpMethod = req.method.toUpperCase()

	// request details
	console.log(`path after trimming: ${trimmedPath} - ${httpMethod}`)
	console.log("****query strings****")
	console.log(Object.assign({}, parsedUrl.query))
	console.log("****request headers****")
	console.log(req.headers)

	// parsing request body
	const decoder = new StringDecoder('utf8')
	let buffer = ''
	req.on('data', function(data){
		buffer += decoder.write(data)
	})

	// handle response
	req.on('end', function(){
		buffer += decoder.end()
		try {
			console.log("****request payload****")
			console.log(JSON.parse(buffer))
			res.end('hello world!\n')
		} catch (error) {
			res.end(responseErrorHandler(res, 400, 'error parsing request body'))
		}	
	})
})

// start the server, listening to port 3000
server.listen(3000, function(){
	console.log('the server is started and listening to port 3000')
})