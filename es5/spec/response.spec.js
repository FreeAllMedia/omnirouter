"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libRouterJs = require("../lib/router.js");

var _libRouterJs2 = _interopRequireDefault(_libRouterJs);

var _libResponseJs = require("../lib/response.js");

var _libResponseJs2 = _interopRequireDefault(_libResponseJs);

var _appeal = require("appeal");

var _appeal2 = _interopRequireDefault(_appeal);

var sinon = require("sinon");

describe("Response(expressResponse)", function () {
	var response = undefined,
	    mockExpressResponse = undefined,
	    router = undefined,
	    options = undefined,
	    portNumber = undefined,
	    host = undefined;

	before(function () {
		// This is where the server we"re testing will be.
		portNumber = 3014;
		host = "http://localhost:" + portNumber;

		// Instantiate router without any options by default.
		options = {
			"some": "options"
		};
	});

	beforeEach(function () {
		mockExpressResponse = {
			status: sinon.spy(function (statusCode) {
				return mockExpressResponse;
			}),
			json: sinon.spy(function (data) {
				return mockExpressResponse;
			})
		};
		response = new _libResponseJs2["default"](mockExpressResponse);
	});

	describe("response.json()", function () {
		var path = undefined,
		    callback = undefined,
		    url = undefined,
		    data = undefined;

		before(function (done) {
			path = "/sagan";
			url = "" + host + path;
			data = { name: "Bob Belcher", age: 46 };

			callback = function (request, response) {
				return response.json(data);
			};

			router = new _libRouterJs2["default"](options);
			router.get(path, callback);
			router.listen(portNumber, done);
		});

		after(function (done) {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should respond with json data", function (done) {
			_appeal2["default"].get.url(url).header("Content-Type", "application/vnd.api+json").results(function (error, response) {
				response.body.should.eql(data);
				done();
			});
		});
	});

	describe("response.send()", function () {
		var path = undefined,
		    callback = undefined,
		    url = undefined,
		    data = undefined;

		before(function (done) {
			path = "/sagan";
			url = "" + host + path;
			data = { name: "Bob Belcher", age: 46 };

			callback = function (request, response) {
				return response.send(data);
			};

			router = new _libRouterJs2["default"](options);
			router.get(path, callback);
			router.listen(portNumber, done);
		});

		after(function (done) {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should respond with json data", function (done) {
			_appeal2["default"].get.url(url).header("Content-Type", "application/vnd.api+json").results(function (error, response) {
				response.body.should.eql(data);
				done();
			});
		});
	});

	describe("response.set", function () {
		var path = undefined,
		    callback = undefined,
		    url = undefined,
		    data = undefined,
		    headerKey = undefined,
		    headerValue = undefined;

		before(function (done) {
			path = "/sagan";
			url = "" + host + path;
			data = { name: "Bob Belcher", age: 46 };
			headerKey = "some-header";
			headerValue = "someValue";

			callback = function (request, response) {
				response.set(headerKey, headerValue);
				response.json(data);
			};

			router = new _libRouterJs2["default"](options);
			router.get(path, callback);
			router.listen(portNumber, done);
		});

		after(function (done) {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should set the header on the response", function (done) {
			_appeal2["default"].get.url(url).results(function (error, response) {
				response.headers[headerKey].should.eql(headerValue);
				done();
			});
		});
	});

	describe("response.get", function () {
		var path = undefined,
		    callback = undefined,
		    url = undefined,
		    data = undefined,
		    headerKey = undefined,
		    headerValue = undefined;

		before(function () {
			path = "/sagan";
			url = "" + host + path;
			data = { name: "Bob Belcher", age: 46 };
			headerKey = "some-header";
			headerValue = "someValue";
		});

		after(function (done) {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should set the header on the response", function (done) {
			callback = function (request, response) {
				response.set(headerKey, headerValue);
				response.get(headerKey).should.equal(headerValue);
				response.json(data);
			};

			router = new _libRouterJs2["default"](options);
			router.get(path, callback);
			router.listen(portNumber, function () {
				_appeal2["default"].get.url(url).results(function (error, response) {
					done();
				});
			});
		});
	});

	describe("response.status(statusCode)", function () {
		var path = undefined,
		    callback = undefined,
		    url = undefined,
		    data = undefined;

		beforeEach(function (done) {
			path = "/sagan";
			url = "" + host + path;
			data = { name: "Bob Belcher", age: 46 };

			callback = function (request, response) {
				response.json(data);
			};

			router = new _libRouterJs2["default"](options);
			router.get(path, callback);
			router.listen(portNumber, done);
		});

		afterEach(function (done) {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should allow chaining", function () {
			response.status(500).should.equal(response);
		});

		it("should respond with the designated status code withouth chaining", function (done) {
			_appeal2["default"].get.url(url).results(function (error, response) {
				response.status.should.eql(200);
				done();
			});
		});
	});

	describe("response.end()", function () {
		var path = undefined,
		    callback = undefined,
		    url = undefined,
		    data = undefined;

		before(function (done) {
			path = "/sagan";
			url = "" + host + path;
			data = "This is a raw message";

			callback = function (request, response) {
				return response.end(data);
			};

			router = new _libRouterJs2["default"](options);
			router.get(path, callback);
			router.listen(portNumber, done);
		});

		after(function (done) {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should respond with raw data", function (done) {
			_appeal2["default"].get.url(url).results(function (error, response) {
				response.body.should.eql(data);
				done();
			});
		});
	});

	describe("(http semanthics)", function () {
		var path = undefined,
		    callback = undefined,
		    url = undefined,
		    data = undefined;

		before(function () {
			path = "/sagan";
			url = "" + host + path;
			data = { name: "Bob Belcher", age: 46 };
		});

		describe("(dynamic functions)", function () {
			//camel cased names from the w3c specification names
			//http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
			var statuses = require("../lib/http.statuses.json");

			statuses.forEach(function (status) {
				it("should load the " + status.name + " status as a member into the response", function () {
					response.should.have.property(status.name);
				});

				it("should load the " + status.name + " status into the object as a function", function () {
					(typeof response[status.name]).should.equal("function");
				});

				describe("response." + status.name + "()", function () {

					before(function (done) {
						callback = function (request, response) {
							return response[status.name](data);
						};

						router = new _libRouterJs2["default"](options);
						router.get(path, callback);
						router.listen(portNumber, done);
					});

					after(function (done) {
						router.close(done);
					});

					it("should call response.status with " + status.code, function (done) {
						_appeal2["default"].get.url(url).results(function (error, response) {
							response.status.should.eql(status.code);
							done();
						});
					});
				});
			});
		});
	});

	xdescribe("response.download()", function () {
		var path = undefined,
		    callback = undefined,
		    url = undefined,
		    data = undefined;

		before(function (done) {
			path = "/trig.png";
			url = "" + host + path;
			data = "This is a raw message";

			callback = function (request, response) {
				response.download(data);
			};

			router = new _libRouterJs2["default"](options);

			router["static"]("trig.png");

			router.get(path, callback);
			router.listen(portNumber, done);
		});

		after(function (done) {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should respond with json data", function (done) {
			_appeal2["default"].get.url(url).header("Content-Type", "application/vnd.api+json").results(function (error, response) {
				response.body.should.eql(data);
				done();
			});
		});
	});
});