import express from "express";
import bodyParser from "body-parser";
import Route from "./route.js";
import privateData from "incognito";

import Response from "./response.js";

const _createRequest = Symbol(),
	_createResponse = Symbol(),
	_defineExpressRoute = Symbol();

export default class Router {
	constructor(...routerOptions) {
		const _ = privateData(this);
		_._express = express();
		_._options = routerOptions;
		_._server = undefined;
		_._middlewares = [];

		_._express.disable("x-powered-by");
		//TYPE is not working by somehow, despites the website says it does
		//https://github.com/expressjs/body-parser
		_._express.use(bodyParser.json({ type: "application/vnd.api+json" }));

		this.initialize(...routerOptions);
	}

	initialize() {} // Stubbed

	listen(portNumber, callback) {
		const _ = privateData(this);
		_._server = _._express.listen(portNumber, callback);
	}

	close(callback) {
		privateData(this)._server.close(callback);
	}

	[_createRequest](expressRequest) {
		return new Request(expressRequest);
	}

	[_createResponse](expressResponse) {
		//propagates the middleware to response formatters
		return new Response(expressResponse, privateData(this)._middlewares);
	}

	[_defineExpressRoute](method, path) {
		const route = new Route(method, path, this);
		route.on("callback", () => {
			privateData(this)._express[method](path, (expressRequest, expressResponse) => {
				return route.handle(this[_createRequest](expressRequest), this[_createResponse](expressResponse));
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
		privateData(this)._middlewares.push(Object.create(middlewareClass.prototype));
	}
}

export class Request {
	constructor(expressRequest) {
		const _ = privateData(this);
		_._request = expressRequest;
		Object.defineProperties(this, {
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
		return privateData(this)._request.get(headerName);
	}
}
