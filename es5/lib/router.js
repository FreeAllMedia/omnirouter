"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _responseJs = require("./response.js");

var _responseJs2 = _interopRequireDefault(_responseJs);

var _upcast = require("upcast");

var _upcast2 = _interopRequireDefault(_upcast);

var express = require("express");
var bodyParser = require("body-parser");

var _createRequest = Symbol(),
    _createResponse = Symbol(),
    _defineExpressRoute = Symbol();

var Router = (function () {
	function Router() {
		_classCallCheck(this, Router);

		for (var _len = arguments.length, routerOptions = Array(_len), _key = 0; _key < _len; _key++) {
			routerOptions[_key] = arguments[_key];
		}

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

		this.initialize.apply(this, routerOptions);
	}

	_createClass(Router, [{
		key: "initialize",
		value: function initialize() {}
	}, {
		key: "listen",
		// Stubbed

		value: function listen(portNumber, callback) {
			this._server = this._express.listen(portNumber, callback);
		}
	}, {
		key: "close",
		value: function close(callback) {
			this._server.close(callback);
		}
	}, {
		key: _createRequest,
		value: function value(expressRequest) {
			return new Request(expressRequest);
		}
	}, {
		key: _createResponse,
		value: function value(expressResponse) {
			//propagates the middleware to response formatters
			return new _responseJs2["default"](expressResponse, this._middlewares);
		}
	}, {
		key: _defineExpressRoute,
		value: function value(method, path) {
			var _this = this;

			var route = new Route(method, path, this);
			route.on("callback", function (routeCallback) {
				_this._express[method](path, function (expressRequest, expressResponse) {
					routeCallback(_this[_createRequest](expressRequest), _this[_createResponse](expressResponse));
				});
			});

			return route;
		}
	}, {
		key: "get",
		value: function get(path, callback) {
			var route = this[_defineExpressRoute]("get", path);

			if (callback !== undefined) {
				route.then(callback);
			}
			return route;
		}
	}, {
		key: "post",
		value: function post(path, callback) {
			var route = this[_defineExpressRoute]("post", path);

			if (callback !== undefined) {
				route.then(callback);
			}
			return route;
		}
	}, {
		key: "put",
		value: function put(path, callback) {
			var route = this[_defineExpressRoute]("put", path);

			if (callback !== undefined) {
				route.then(callback);
			}
			return route;
		}
	}, {
		key: "delete",
		value: function _delete(path, callback) {
			var route = this[_defineExpressRoute]("delete", path);

			if (callback !== undefined) {
				route.then(callback);
			}
			return route;
		}
	}, {
		key: "use",
		value: function use(middlewareClass) {
			this._middlewares.push(Object.create(middlewareClass.prototype));
		}
	}]);

	return Router;
})();

exports["default"] = Router;

var Request = (function () {
	function Request(expressRequest) {
		_classCallCheck(this, Request);

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

	_createClass(Request, [{
		key: "header",
		value: function header(headerName) {
			return this._request.get(headerName);
		}
	}]);

	return Request;
})();

exports.Request = Request;

var Route = (function (_EventEmitter) {
	function Route(type, path, router) {
		_classCallCheck(this, Route);

		_get(Object.getPrototypeOf(Route.prototype), "constructor", this).call(this);
		this.setMaxListeners(0);
		Object.defineProperties(this, {
			"type": { value: type },
			"path": { value: path },
			"router": { value: router },
			"_casts": { value: [] },
			"callback": { value: null, writable: true }
		});
	}

	_inherits(Route, _EventEmitter);

	_createClass(Route, [{
		key: "cast",
		value: function cast(parameterName, parameterType) {
			//TODO parameterName validation with path
			if (this.path.indexOf(":" + parameterName) < 0) {
				throw new Error("Parameter " + parameterName + " not found in the route path.");
			}
			this._casts.push({ name: parameterName, type: parameterType });
			return this;
		}
	}, {
		key: "then",
		value: function then(callback) {
			var _this2 = this;

			var castCallback = function castCallback(request, response) {
				//TODO iterate casts and cast on the request
				_this2._casts.forEach(function (cast) {
					if (request && request.params[cast.name]) {
						var type = "string";
						switch (cast.type) {
							case Number:
								type = "number";
								break;
						}
						request.params[cast.name] = _upcast2["default"].to(request.params[cast.name], type);
					}
				});
				return callback(request, response);
			};
			this.callback = castCallback;
			this.emit("callback", this.callback);
		}
	}]);

	return Route;
})(_events2["default"]);

exports.Route = Route;