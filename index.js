/* 
 * Primary file for the API 
 *
 */

// Dependencies
const http = require('node:http')
const https = require('node:https')
const fs = require('node:fs')
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

function serverHandler(req, res){
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
}

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

const { httpPort, httpsPort, env } = config

// the httpServer response to API requests
const httpServer = http.createServer(serverHandler)

// start the http server, listening to port passed by configuration
httpServer.listen(httpPort, function(){
	console.log(`the ${env} server is started and listening to port ${httpPort}`)
})


// the httpsServer response to API requests
const httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsServerOptions, serverHandler)
// start the https server, listening to port passed by configuration
httpsServer.listen(httpsPort, function(){
	console.log(`the ${env} server is started and listening to port ${httpsPort}`)
})