/* 
 * Primary file for the API 
 *
 */

// Dependencies
const http = require('http')

// the server response to API requests
const server = http.createServer(function(req, res){
	res.end('hello world!\n')
})

// start the server, listening to port 3000
server.listen(3000, function(){
	console.log('the server is started and listening to port 3000')
})