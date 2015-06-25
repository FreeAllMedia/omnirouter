# Omnirouter.js [![npm version](https://img.shields.io/npm/v/omnirouter.svg)](https://www.npmjs.com/package/omnirouter) [![license type](https://img.shields.io/npm/l/omnirouter.svg)](https://github.com/FreeAllMedia/omnirouter.git/blob/master/LICENSE) [![npm downloads](https://img.shields.io/npm/dm/omnirouter.svg)](https://www.npmjs.com/package/omnirouter) ![ECMAScript 6](https://img.shields.io/badge/ECMAScript-6-red.svg)

ES6 Component for message routing with middleware support for formatters and other stuff, and built-in message body parsing features. It also provides a semantic self-documented response. Look at this:

```javascript
import Router from "omnirouter";
import JsonApiFormatter from "jsonapi-formatter";

class UserRouter extends Router {
	initialize(...options) {
		/* Entity Controller Routes */
		const entityController = new ItemController();
		this.get('/entity/:id', (request, response) => {
			response.ok({success: true});
		});
		this.post('/entity', (request, response) => {
			response.created(new Error("please don't do that"));
		});
		this.put('/entity/:id', (request, response) => {
			response.unauthorized(new Error("No way you can do that"));
		});
		this.delete('/entity/:id', (request, response) => {
			response.noContent();
		});
		this.get('/entities', (request, response) => {
			response.notImplemented();
		});
	}
}

let router = new ContentServerRouter();
router.use(JsonApiFormatter); //example json api middleware
router.listen(portNumber, (error,) => {
	//do something
	router.close(() => {
		//bye bye router
	});
});
```

# Quality and Compatibility

[![Build Status](https://travis-ci.org/FreeAllMedia/omnirouter.png?branch=master)](https://travis-ci.org/FreeAllMedia/omnirouter) [![Coverage Status](https://coveralls.io/repos/FreeAllMedia/omnirouter/badge.svg)](https://coveralls.io/r/FreeAllMedia/omnirouter) [![Code Climate](https://codeclimate.com/github/FreeAllMedia/omnirouter/badges/gpa.svg)](https://codeclimate.com/github/FreeAllMedia/omnirouter) [![Dependency Status](https://david-dm.org/FreeAllMedia/omnirouter.png?theme=shields.io)](https://david-dm.org/FreeAllMedia/omnirouter?theme=shields.io) [![Dev Dependency Status](https://david-dm.org/FreeAllMedia/omnirouter/dev-status.svg)](https://david-dm.org/FreeAllMedia/omnirouter?theme=shields.io#info=devDependencies)

*Every build and release is automatically tested on the following platforms:*

![node 0.12.x](https://img.shields.io/badge/node-0.12.x-brightgreen.svg) ![node 0.11.x](https://img.shields.io/badge/node-0.11.x-brightgreen.svg) ![node 0.10.x](https://img.shields.io/badge/node-0.10.x-brightgreen.svg)
![iojs 2.x.x](https://img.shields.io/badge/iojs-2.x.x-brightgreen.svg) ![iojs 1.x.x](https://img.shields.io/badge/iojs-1.x.x-brightgreen.svg)



*If your platform is not listed above, you can test your local environment for compatibility by copying and pasting the following commands into your terminal:*

```
npm install omnirouter
cd node_modules/omnirouter
gulp test-local
```

# Installation

Copy and paste the following command into your terminal to install Omnirouter:

```
npm install omnirouter --save
```

## Import / Require

```
// ES6
import omnirouter from "omnirouter";
```

```
// ES5
var omnirouter = require("omnirouter");
```

```
// Require.js
define(["require"] , function (require) {
    var omnirouter = require("omnirouter");
});
```

# Getting Started
Omnirouter gives you by default a base Router class, but it also uses two other classes Request and Response.
The Request is a representation of the message received by the transport and the Response is the representation to be sent back to the transport.
You can attach middleware to Omnirouter and it has some functionality already built in like body parsing features.
The middleware can be for example a http://jsonapi.org/format like formatter for responses. There is a package for that provided on https://github.com/FreeAllMedia/jsonapi-formatter

## Using omnirouter
Usually you extend the Router and put some route initialization stuff on it.

```javascript
import Router from "omnirouter";
import JsonApiFormatter from "jsonapi-formatter";

class UserRouter extends Router {
	initialize(...options) {
		/* Entity Controller Routes */
		const entityController = new ItemController();
		this.get('/entity/:id', (request, response) => {
			response.ok({success: true});
		});
		this.post('/entity', (request, response) => {
			response.created(new Error("please don't do that"));
		});
		this.put('/entity/:id', (request, response) => {
			response.unauthorized(new Error("No way you can do that"));
		});
		this.delete('/entity/:id', (request, response) => {
			response.noContent();
		});
		this.get('/entities', (request, response) => {
			response.notImplemented();
		});
	}
}
```
And after that you may want to start listening on some port.

```javascript
let router = new ContentServerRouter();
router.use(JsonApiFormatter); //example json api middleware
router.listen(portNumber, (error,) => {
	//do something
	router.close(() => {
		//bye bye router
	});
});
```

### Router object
The Router object provides the following methods:
#### get(path, callback)
#### post(path, callback)
#### put(path, callback)
#### delete(path, callback)
This transport verb methods are useful to define routes. It receives the <path> which is a string according to the express docs, and a <callback> which is a handler that will receive the Omnirouter's request and response objects.

#### use(middlewareClass)
With this method you define middleware classes to be used on some scenarios.

#### listen(portNumber, callback<error>)
With this method the router will lift a server on the specified <portNumber> and will call the specified <callback> with the error if there was one according to the express docs.

#### close(callback<error>)
Close will stop the server from listening on that port using the callback as usual.

### Request object
The Request object is the first argument on your handler function and it contains the following properties and methods:
#### body
This property returns the request body is there is any.
#### params
This property returns the params received in the request according to express docs.
#### header(name)
This method will return the value for the specified header <name>.

### Response object
The Response object is the second argument provided on route handlers. It provides some useful properties and methods:
#### end
Calls the express's end.
#### status
Sets the response status. Calls the express's status.
#### json
Calls the express's response.json.
#### send
Calls the express's response.send.
#### download
Calls the express's response.download.
#### set
Calls the express's response.set.
#### get
Calls the express's response.get.

And also all this methods returns the appropiate http status in a self-documented way according to the [HTTP Status RFC](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html).
#### ok(data)
#### internalServerError(data)
#### forbidden(data)
#### unauthorized(data)
...and that infinte list.

# How to Contribute

See something that could use improvement? Have a great feature idea? We listen!

You can submit your ideas through our [issues system](https://github.com/FreeAllMedia/omnirouter/issues), or make the modifications yourself and submit them to us in the form of a [GitHub pull request](https://help.github.com/articles/using-pull-requests/).

We always aim to be friendly and helpful.

## Running Tests

It's easy to run the test suite locally, and *highly recommended* if you're using Omnirouter.js on a platform we aren't automatically testing for.

```
npm test
```



