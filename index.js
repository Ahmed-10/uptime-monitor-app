/* 
 * Primary file for the API 
 *
 */

// Dependencies
const http = require('http')
const url = require('url')

// the server response to API requests
const server = http.createServer(function(req, res){
	const parsedUrl = url.parse(req.url, true)
	// cleaning pathname from prefixed and postfixed slashes
	const trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, '')
	
	res.end('hello world!\n')

	console.log(`Request received on path: ${parsedUrl.pathname}`)
	console.log(`path after trimming: ${trimmedPath}`)
})

// start the server, listening to port 3000
server.listen(3000, function(){
	console.log('the server is started and listening to port 3000')
})