/*
 * create and export configuration variables
 *
 */

// container for all the environments
const environments = {}

// staging: default environement
environments.staging = {
	httpPort: 3000,
	httpsPort: 3001,
	env: 'staging',
}

// production environment
environments.production = {
	httpPort: 5000,
	httpsPort: 5001,
	env: 'production'
}

const environement = process.env.NODE_ENV ?? ''
const workingEnvironement = environments[environement] ?? environments.staging

module.exports = workingEnvironement