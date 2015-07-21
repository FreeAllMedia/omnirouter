"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _routeJs = require("./route.js");

var _routeJs2 = _interopRequireDefault(_routeJs);

var _responseJs = require("./response.js");

var _responseJs2 = _interopRequireDefault(_responseJs);

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
				value: (0, _express2["default"])()
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
		this._express.use(_bodyParser2["default"].json({ type: "application/vnd.api+json" }));

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

			var route = new _routeJs2["default"](method, path, this);
			route.on("callback", function () {
				_this._express[method](path, function (expressRequest, expressResponse) {
					return route.handle(_this[_createRequest](expressRequest), _this[_createResponse](expressResponse));
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