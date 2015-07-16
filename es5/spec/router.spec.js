"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _libRouterJs = require("../lib/router.js");

var _libRouterJs2 = _interopRequireDefault(_libRouterJs);

var _libResponseJs = require("../lib/response.js");

var _libResponseJs2 = _interopRequireDefault(_libResponseJs);

var _appeal = require("appeal");

var _appeal2 = _interopRequireDefault(_appeal);

var _jsonapiFormatter = require("jsonapi-formatter");

var _jsonapiFormatter2 = _interopRequireDefault(_jsonapiFormatter);

var sinon = require("sinon");

describe("Router(...options)", function () {
	var router = undefined,
	    options = undefined,
	    portNumber = undefined,
	    host = undefined,
	    url = undefined,
	    server = undefined;

	before(function () {
		// This is where the server we"re testing will be.
		portNumber = 3014;
		host = "http://localhost:" + portNumber;

		// Instantiate router without any options by default.
		options = {
			"some": "options"
		};
	});

	// We"re not implementing any options for now.
	//
	// describe("options", () => {
	// 	describe("caseSensitive", () => {});
	// 	describe("strict", () => {});
	// });
	//

	describe(".initialize()", function () {
		var initializeSpy = undefined;

		var UserRouter = (function (_Router) {
			function UserRouter() {
				_classCallCheck(this, UserRouter);

				_get(Object.getPrototypeOf(UserRouter.prototype), "constructor", this).apply(this, arguments);
			}

			_inherits(UserRouter, _Router);

			_createClass(UserRouter, [{
				key: "initialize",
				value: function initialize() {
					initializeSpy.apply(undefined, arguments);
				}
			}]);

			return UserRouter;
		})(_libRouterJs2["default"]);

		beforeEach(function () {
			initializeSpy = sinon.spy();
		});

		it("should be called after instantiation", function () {
			var userRouter = new UserRouter();
			initializeSpy.called.should.be["true"];
		});

		it("should be called with the options provided to the constructor", function () {
			var userRouter = new UserRouter(options);
			initializeSpy.firstCall.args[0].should.eql(options);
		});
	});

	describe("Request(expressLikeRequest)", function () {
		describe("request.header(headerName)", function () {
			var mockExpressRequest = undefined,
			    headers = undefined;

			before(function () {
				headers = {
					"Api-Key": "SomeApiKey"
				};
				mockExpressRequest = {
					get: function get(headerName) {
						return headers[headerName];
					}
				};
			});

			it("should get the header by name", function () {
				var request = new _libRouterJs.Request(mockExpressRequest);
				request.header("Api-Key").should.equal(headers["Api-Key"]);
			});
		});

		describe("request.body", function () {
			var mockExpressRequest = undefined,
			    mockExpressNoMiddlewareRequest = undefined,
			    headers = undefined;

			before(function () {
				headers = {
					"Api-Key": "SomeApiKey"
				};
				mockExpressRequest = {
					body: { "this": "should not throw an error" }
				};
				mockExpressNoMiddlewareRequest = {
					body: "{'this': 'should throw an error'}"
				};
			});

			it("should return json data already parsed", function () {
				var request = new _libRouterJs.Request(mockExpressRequest);
				request.body.should.eql(mockExpressRequest.body);
			});

			it("should error when json is passed unparsed", function () {
				(function () {
					var request = new _libRouterJs.Request(mockExpressNoMiddlewareRequest);
				}).should["throw"]("express JSON parsing middleware appears to be missing");
			});
		});

		describe("request.params", function () {
			var mockExpressRequest = undefined,
			    params = undefined;

			before(function () {
				params = { id: "someId" };
				mockExpressRequest = {
					params: params
				};
			});

			it("should get a parameter by name", function () {
				var request = new _libRouterJs.Request(mockExpressRequest);
				request.params.id.should.equal(params.id);
			});
		});
	});

	describe(".get(path, callback)", function () {
		var path = undefined,
		    callback = undefined,
		    url = undefined;

		before(function (done) {
			path = "/spock";
			url = "" + host + path;

			callback = sinon.spy(function (request, response) {
				response.end();
			});

			router = new _libRouterJs2["default"](options);
			router.get(path, callback);
			router.listen(portNumber, done);
		});

		after(function (done) {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should callback when the path is requested with GET", function (done) {
			_appeal2["default"].get.url(url).results(function (error, response) {
				callback.called.should.be["true"];
				done();
			});
		});

		it("should callback with the request object", function (done) {
			_appeal2["default"].get.url(url).results(function (error, response) {
				callback.firstCall.args[0].should.be.instanceOf(_libRouterJs.Request);
				done();
			});
		});

		it("should callback with a response object", function (done) {
			_appeal2["default"].get.url(url).results(function (error, response) {
				callback.firstCall.args[1].should.be.instanceOf(_libResponseJs2["default"]);
				done();
			});
		});

		it("should respond without an X-Powered-By header", function (done) {
			_appeal2["default"].get.url(url).results(function (error, response) {
				(response.headers["x-powered-by"] === undefined).should.be["true"];
				done();
			});
		});
	});

	describe(".post(path, callback)", function () {
		var path = undefined,
		    callback = undefined,
		    url = undefined;

		before(function (done) {
			path = "/spork";
			url = "" + host + path;

			callback = sinon.spy(function (request, response) {

				response.end();
			});

			router = new _libRouterJs2["default"](options);
			router.post(path, callback);
			router.listen(portNumber, done);
		});

		after(function (done) {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should callback when the path is requested with POST", function (done) {
			_appeal2["default"].post.url(url).results(function (error, response) {
				callback.called.should.be["true"];
				done();
			});
		});

		it("should callback with the request object", function (done) {
			_appeal2["default"].post.url(url).results(function (error, response) {
				callback.firstCall.args[0].should.be.instanceOf(_libRouterJs.Request);
				done();
			});
		});

		it("should callback with a response object", function (done) {
			_appeal2["default"].post.url(url).results(function (error, response) {
				callback.firstCall.args[1].should.be.instanceOf(_libResponseJs2["default"]);
				done();
			});
		});
	});

	describe(".put(path, callback)", function () {
		var path = undefined,
		    callback = undefined,
		    url = undefined;

		before(function (done) {
			path = "/spork";
			url = "" + host + path;

			callback = sinon.spy(function (request, response) {

				response.end();
			});

			router = new _libRouterJs2["default"](options);
			router.put(path, callback);
			router.listen(portNumber, done);
		});

		after(function (done) {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should callback when the path is requested with PUT", function (done) {
			_appeal2["default"].put.url(url).results(function (error, response) {
				callback.called.should.be["true"];
				done();
			});
		});

		it("should callback with the request object", function (done) {
			_appeal2["default"].put.url(url).results(function (error, response) {
				callback.firstCall.args[0].should.be.instanceOf(_libRouterJs.Request);
				done();
			});
		});

		it("should callback with a response object", function (done) {
			_appeal2["default"].put.url(url).results(function (error, response) {
				callback.firstCall.args[1].should.be.instanceOf(_libResponseJs2["default"]);
				done();
			});
		});
	});

	describe(".delete(path, callback)", function () {
		var path = undefined,
		    callback = undefined,
		    url = undefined;

		before(function (done) {
			path = "/spork";
			url = "" + host + path;

			callback = sinon.spy(function (request, response) {

				response.end();
			});

			router = new _libRouterJs2["default"](options);
			router["delete"](path, callback);
			router.listen(portNumber, done);
		});

		after(function (done) {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should callback when the path is requested with DELETE", function (done) {
			_appeal2["default"]["delete"].url(url).results(function (error, response) {
				callback.called.should.be["true"];
				done();
			});
		});

		it("should callback with the request object", function (done) {
			_appeal2["default"]["delete"].url(url).results(function (error, response) {
				callback.firstCall.args[0].should.be.instanceOf(_libRouterJs.Request);
				done();
			});
		});

		it("should callback with a response object", function (done) {
			_appeal2["default"]["delete"].url(url).results(function (error, response) {
				callback.firstCall.args[1].should.be.instanceOf(_libResponseJs2["default"]);
				done();
			});
		});
	});

	describe(".static(path, callback)", function () {
		var path = undefined,
		    callback = undefined,
		    url = undefined;

		before(function (done) {
			path = "/spock";
			url = "" + host + path;

			callback = sinon.spy(function (request, response) {
				response.end();
			});

			router = new _libRouterJs2["default"](options);
			router.get(path, callback);
			router.listen(portNumber, done);
		});

		after(function (done) {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should setup a GET request listener for ");

		it("should callback when the path is requested with GET", function (done) {
			_appeal2["default"].get.url(url).results(function (error, response) {
				callback.called.should.be["true"];
				done();
			});
		});

		it("should callback with the request object", function (done) {
			_appeal2["default"].get.url(url).results(function (error, response) {
				callback.firstCall.args[0].should.be.instanceOf(_libRouterJs.Request);
				done();
			});
		});

		it("should callback with a response object", function (done) {
			_appeal2["default"].get.url(url).results(function (error, response) {
				callback.firstCall.args[1].should.be.instanceOf(_libResponseJs2["default"]);
				done();
			});
		});
	});

	describe("(chaining)", function () {
		describe(".get", function () {
			var route = undefined,
			    path = undefined,
			    url = undefined,
			    callback = undefined;

			before(function (done) {
				router = new _libRouterJs2["default"]();
				callback = sinon.spy(function (request, response) {
					response.end();
				});
				path = "/chained-spock";
				url = "" + host + path;
				route = router.get(path);
				route.then(callback);
				router.listen(portNumber, done);
			});

			after(function (done) {
				router.close(done);
			});

			it("should return a Route instance", function () {
				route.should.be.instanceOf(_libRouterJs.Route);
			});

			it("should callback", function (done) {
				_appeal2["default"].get.url(url).results(function () {
					callback.called.should.be["true"];
					done();
				});
			});
		});

		describe(".post", function () {
			var route = undefined,
			    path = undefined,
			    url = undefined,
			    callback = undefined;

			before(function (done) {
				router = new _libRouterJs2["default"]();
				callback = sinon.spy(function (request, response) {
					response.end();
				});
				path = "/chained-spock";
				url = "" + host + path;
				route = router.post(path);
				route.then(callback);
				router.listen(portNumber, done);
			});

			after(function (done) {
				router.close(done);
			});

			it("should return a Route instance", function () {
				route.should.be.instanceOf(_libRouterJs.Route);
			});

			it("should callback", function (done) {
				_appeal2["default"].post.url(url).results(function () {
					callback.called.should.be["true"];
					done();
				});
			});
		});

		describe(".put", function () {
			var route = undefined,
			    path = undefined,
			    url = undefined,
			    callback = undefined;

			before(function (done) {
				router = new _libRouterJs2["default"]();
				callback = sinon.spy(function (request, response) {
					response.end();
				});
				path = "/chained-spock";
				url = "" + host + path;
				route = router.put(path);
				route.then(callback);
				router.listen(portNumber, done);
			});

			after(function (done) {
				router.close(done);
			});

			it("should return a Route instance", function () {
				route.should.be.instanceOf(_libRouterJs.Route);
			});

			it("should callback", function (done) {
				_appeal2["default"].put.url(url).results(function () {
					callback.called.should.be["true"];
					done();
				});
			});
		});

		describe(".delete", function () {
			var route = undefined,
			    path = undefined,
			    url = undefined,
			    callback = undefined;

			before(function (done) {
				router = new _libRouterJs2["default"]();
				callback = sinon.spy(function (request, response) {
					response.end();
				});
				path = "/chained-spock";
				url = "" + host + path;
				route = router["delete"](path);
				route.then(callback);
				router.listen(portNumber, done);
			});

			after(function (done) {
				router.close(done);
			});

			it("should return a Route instance", function () {
				route.should.be.instanceOf(_libRouterJs.Route);
			});

			it("should callback", function (done) {
				_appeal2["default"]["delete"].url(url).results(function () {
					callback.called.should.be["true"];
					done();
				});
			});
		});
	});

	describe("(middleware)", function () {
		describe(".use(middleware)", function () {
			var path = undefined,
			    callback = undefined,
			    url = undefined,
			    data = undefined;

			before(function () {
				path = "/sagan";
				url = "" + host + path;
			});

			it("should push every semanthic method through the formater middleware", function () {
				//camel cased names from the w3c specification names
				//http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
				var statuses = require("../../http.statuses.json");
				describe("(jsonapi-formatter middleware)", function () {
					statuses.forEach(function (status) {
						describe("response." + status.name + "()", function () {

							if (status.code >= 300) {
								describe("(with an error instance)", function () {
									before(function (done) {
										data = new Error("some error data");
										callback = function (request, response) {
											return response[status.name](data);
										};

										router = new _libRouterJs2["default"](options);
										router.get(path, callback);
										//inject middleware
										router.use(_jsonapiFormatter2["default"]);
										router.listen(portNumber, done);
									});

									after(function (done) {
										// We have to close the server after testing is complete
										// or else it will be left listening on the test port
										router.close(done);
									});

									it("should respond with the given error under a jsonapi envelope using the plugin", function (done) {
										_appeal2["default"].get.url(url).header("content-type", "application/vnd.api+json; charset=utf-8").results(function (error, response) {
											response.body.should.eql({ errors: [{ title: data.name, details: data.message }] });
											done();
										});
									});
								});

								describe("(with an error array)", function () {
									before(function (done) {
										data = new Error("some error data");
										callback = function (request, response) {
											return response[status.name]([data]);
										};

										router = new _libRouterJs2["default"](options);
										router.get(path, callback);
										//inject middleware
										router.use(_jsonapiFormatter2["default"]);
										router.listen(portNumber, done);
									});

									after(function (done) {
										// We have to close the server after testing is complete
										// or else it will be left listening on the test port
										router.close(done);
									});

									it("should response with the given error array under a jsonapi envelope using the plugin", function (done) {
										_appeal2["default"].get.url(url).header("content-type", "application/vnd.api+json; charset=utf-8").results(function (error, response) {
											response.body.should.eql({ errors: [{ title: data.name, details: data.message }] });
											done();
										});
									});
								});
							} else {
								describe("(with a bunch of data)", function () {
									before(function (done) {
										data = { name: "Bob Belcher", age: 46 };
										callback = function (request, response) {
											return response[status.name](data);
										};

										router = new _libRouterJs2["default"](options);
										router.get(path, callback);
										router.use(_jsonapiFormatter2["default"]);
										router.listen(portNumber, done);
									});

									after(function (done) {
										// We have to close the server after testing is complete
										// or else it will be left listening on the test port
										router.close(done);
									});

									it("should respond with the given data under a jsonapi envelope using the plugin", function (done) {
										_appeal2["default"].get.url(url).header("content-type", "application/vnd.api+json").results(function (error, response) {
											if (response.body) {
												response.body.should.eql({ data: data });
											} else {
												response.status.should.equal(status.code);
											}
											done();
										});
									});
								});
							}
						});
					});
				});
			});
		});
	});
});