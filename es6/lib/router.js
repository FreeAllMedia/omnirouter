const express = require("express");
const bodyParser = require("body-parser");

import Response from "./response.js";

const _createRequest = Symbol(),
	_createResponse = Symbol();

export default class Router {
	constructor(...routerOptions) {
		Object.defineProperties(this, {
			"_express": {
				enumerable: false,
				value: express()
			},
			"_options": {
				enumerable: false,
				value: routerOptions
			},
			"_server": {
				writable: true,
				enumerable: false,
				value: undefined
			},
			"_middlewares": {
				enumerable: false,
				value: []
			}
		});

		this._express.disable("x-powered-by");
		//TYPE is not working by somehow, despites the website says it does
		//https://github.com/expressjs/body-parser
		this._express.use(bodyParser.json({ type: "application/vnd.api+json" }));

		this.initialize(...routerOptions);
	}

	initialize() {} // Stubbed

	listen(portNumber, callback) {
		this._server = this._express.listen(portNumber, callback);
	}

	close(callback) {
		this._server.close(callback);
	}

	[_createRequest](expressRequest) {
		return new Request(expressRequest);
	}

	[_createResponse](expressResponse) {
		//propagates the middleware to response formatters
		return new Response(expressResponse, this._middlewares);
	}

	get(path, callback) {
		this._express.get(path, (expressRequest, expressResponse) => {
			callback(this[_createRequest](expressRequest), this[_createResponse](expressResponse));
		});
	}

	post(path, callback) {
		this._express.post(path, (expressRequest, expressResponse) => {
			callback(this[_createRequest](expressRequest), this[_createResponse](expressResponse));
		});
	}

	put(path, callback) {
		this._express.put(path, (expressRequest, expressResponse) => {
			callback(this[_createRequest](expressRequest), this[_createResponse](expressResponse));
		});
	}

	delete(path, callback) {
		this._express.delete(path, (expressRequest, expressResponse) => {
			callback(this[_createRequest](expressRequest), this[_createResponse](expressResponse));
		});
	}

	use(middlewareClass) {
		this._middlewares.push(Object.create(middlewareClass.prototype));
	}
}

export class Request {
	constructor(expressRequest) {
		Object.defineProperties(this, {
			"_request": {
				enumerable: false,
				value: expressRequest
			},
			"body": {
				enumerable: true,
				value: expressRequest.body
			},
			"params": {
				enumerable: true,
				value: expressRequest.params
			}
		});

		if (typeof this.body === "string") {
			throw Error("express JSON parsing middleware appears to be missing");
		}
	}

	header(headerName) {
		return this._request.get(headerName);
	}
}

