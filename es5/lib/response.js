"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var loadDynamicMethods = Symbol();

var Response = (function () {
	function Response(expressResponse, middlewares) {
		_classCallCheck(this, Response);

		var _ = (0, _incognito2["default"])(this);
		_._response = expressResponse;
		_._middlewares = middlewares;

		this[loadDynamicMethods]();
	}

	_createClass(Response, [{
		key: loadDynamicMethods,
		value: function value() {
			var _this = this;

			var _ = (0, _incognito2["default"])(this);
			var statuses = require("../../http.statuses.json");
			if (Array.isArray(statuses)) {
				statuses.forEach(function (status) {
					_this[status.name] = function (data) {
						//call hook for data format middleware in a pipeline
						_._middlewares.forEach(function (middleware) {
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
			(0, _incognito2["default"])(this)._response.end(message);
		}
	}, {
		key: "status",
		value: function status(code) {
			(0, _incognito2["default"])(this)._response.status(code);
			return this;
		}
	}, {
		key: "json",
		value: function json(data) {
			(0, _incognito2["default"])(this)._response.json(data);
		}
	}, {
		key: "send",
		value: function send(data) {
			(0, _incognito2["default"])(this)._response.send(data);
		}
	}, {
		key: "download",
		value: function download(data) {
			(0, _incognito2["default"])(this)._response.download(data);
		}
	}, {
		key: "set",
		value: function set(key, value) {
			(0, _incognito2["default"])(this)._response.set(key, value);
		}
	}, {
		key: "get",
		value: function get(key) {
			return (0, _incognito2["default"])(this)._response.get(key);
		}
	}]);

	return Response;
})();

exports["default"] = Response;
module.exports = exports["default"];