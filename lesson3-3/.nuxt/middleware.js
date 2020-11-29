const middleware = {}

middleware['authenticated'] = require('..\\middleware\\authenticated.js')
middleware['authenticated'] = middleware['authenticated'].default || middleware['authenticated']

middleware['noauthenticated'] = require('..\\middleware\\noauthenticated.js')
middleware['noauthenticated'] = middleware['noauthenticated'].default || middleware['noauthenticated']

export default middleware
