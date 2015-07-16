const express = require("express");
const bodyParser = require("body-parser");
import EventEmitter from "events";

import Response from "./response.js";
import upcast from "upcast";

const _createRequest = Symbol(),
	_createResponse = Symbol(),
	_defineExpressRoute = Symbol();

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

	[_defineExpressRoute](method, path) {
		const route = new Route(path, this);
		route.on("callback", (routeCallback) => {
			this._express[method](path, (expressRequest, expressResponse) => {
				routeCallback(this[_createRequest](expressRequest), this[_createResponse](expressResponse));
			});
		});

		return route;
	}

	get(path, callback) {
		const route = this[_defineExpressRoute]("get", path);

		if(callback !== undefined) {
			route.then(callback);
		}
		return route;
	}

	post(path, callback) {
		const route = this[_defineExpressRoute]("post", path);

		if(callback !== undefined) {
			route.then(callback);
		}
		return route;
	}

	put(path, callback) {
		const route = this[_defineExpressRoute]("put", path);

		if(callback !== undefined) {
			route.then(callback);
		}
		return route;
	}

	delete(path, callback) {
		const route = this[_defineExpressRoute]("delete", path);

		if(callback !== undefined) {
			route.then(callback);
		}
		return route;
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

export class Route extends EventEmitter {
	constructor(type, path, router) {
		super();
		this.setMaxListeners(0);
		Object.defineProperties(this,
			{
				"type": {value: type},
				"path": {value: path},
				"router": {value: router}
			});
	}

	cast(parameterName) {
		
	}

	then(callback) {
		Object.defineProperty(this, "callback", {value: callback});
		this.emit("callback", this.callback);
	}
}
