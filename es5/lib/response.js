"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var loadDynamicMethods = Symbol();

var Response = (function () {
	function Response(expressResponse, middlewares) {
		_classCallCheck(this, Response);

		Object.defineProperties(this, {
			"_response": {
				enumerable: false,
				value: expressResponse
			},
			"_middlewares": {
				enumerable: false,
				value: middlewares
			}
		});

		this[loadDynamicMethods]();
	}

	_createClass(Response, [{
		key: loadDynamicMethods,
		value: function value() {
			var _this = this;

			var statuses = require("../../http.statuses.json");
			if (Array.isArray(statuses)) {
				statuses.forEach(function (status) {
					_this[status.name] = function (data) {
						//call hook for data format middleware in a pipeline
						_this._middlewares.forEach(function (middleware) {
							if (middleware.formatResponse && typeof middleware.formatResponse === "function") {
								middleware.formatResponse(_this);
							}

							if (middleware.format && typeof middleware.format === "function") {
								data = middleware.format(data);
							}
						});

						_this.status(status.code).send(data);
					};
				});
			}
		}
	}, {
		key: "end",
		value: function end(message) {
			this._response.end(message);
		}
	}, {
		key: "status",
		value: function status(code) {
			this._response.status(code);
			return this;
		}
	}, {
		key: "json",
		value: function json(data) {
			this._response.json(data);
		}
	}, {
		key: "send",
		value: function send(data) {
			this._response.send(data);
		}
	}, {
		key: "download",
		value: function download(data) {
			this._response.download(data);
		}
	}, {
		key: "set",
		value: function set(key, value) {
			this._response.set(key, value);
		}
	}, {
		key: "get",
		value: function get(key) {
			return this._response.get(key);
		}
	}]);

	return Response;
})();

exports["default"] = Response;
module.exports = exports["default"];