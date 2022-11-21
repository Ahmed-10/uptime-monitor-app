/*
 * create and export configuration variables
 *
 */

// container for all the environments
const environments = {}

// staging: default environement
environments.staging = {
	port: 3000,
	env: 'staging'
}

// production environment
environments.production = {
	port: 5000,
	env: 'production'
}

const environement = process.env.NODE_ENV ?? ''
const workingEnvironement = environments[environement] ?? environments.staging

module.exports = workingEnvironement