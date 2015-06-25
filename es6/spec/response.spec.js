let sinon = require("sinon");

import Router from "../router.js";
import Response from "../response.js";

import Request from "../../request/request.js";

describe("Response(expressResponse)", () => {
	let response,
		mockExpressResponse,
		router,
		options,
		portNumber,
		host;

	before(() => {
		// This is where the server we"re testing will be.
		portNumber = 3014;
		host = `http:\/\/localhost:${portNumber}`;

		// Instantiate router without any options by default.
		options = {
			"some": "options"
		};
	});

	beforeEach(() => {
		mockExpressResponse = {
			status: sinon.spy((statusCode) => {
				return mockExpressResponse;
			}),
			json: sinon.spy((data) => {
				return mockExpressResponse;
			})
		};
		response = new Response(mockExpressResponse);
	});

	describe("response.json()", () => {
		let path,
			callback,
			url,
			data;

		before((done) => {
			path = "/sagan";
			url = `${host}${path}`;
			data = {name: "Bob Belcher", age: 46};

			callback = (request, response) => response.json(data);

			router = new Router(options);
			router.get(path, callback);
			router.listen(portNumber, done);
		});

		after((done) => {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should respond with json data", done => {
			Request.get
				.url(url)
				.header("Content-Type", "application/vnd.api+json")
				.results((error, response) => {
					response.body.should.eql(data);
					done();
				});
		});
	});

	describe("response.send()", () => {
		let path,
			callback,
			url,
			data;

		before((done) => {
			path = "/sagan";
			url = `${host}${path}`;
			data = {name: "Bob Belcher", age: 46};

			callback = (request, response) => response.send(data);

			router = new Router(options);
			router.get(path, callback);
			router.listen(portNumber, done);
		});

		after((done) => {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should respond with json data", done => {
			Request.get
				.url(url)
				.header("Content-Type", "application/vnd.api+json")
				.results((error, response) => {
					response.body.should.eql(data);
					done();
				});
		});
	});

	describe("response.set", () => {
		let path,
			callback,
			url,
			data,
			headerKey,
			headerValue;

		before((done) => {
			path = "/sagan";
			url = `${host}${path}`;
			data = {name: "Bob Belcher", age: 46};
			headerKey = "some-header";
			headerValue = "someValue";

			callback = (request, response) => {
				response.set(headerKey, headerValue);
				response.json(data);
			};

			router = new Router(options);
			router.get(path, callback);
			router.listen(portNumber, done);
		});

		after((done) => {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should set the header on the response", done => {
			Request.get
				.url(url)
				.results((error, response) => {
					response.headers[headerKey].should.eql(headerValue);
					done();
				});
		});
	});

	describe("response.get", () => {
		let path,
			callback,
			url,
			data,
			headerKey,
			headerValue;

		before(() => {
			path = "/sagan";
			url = `${host}${path}`;
			data = {name: "Bob Belcher", age: 46};
			headerKey = "some-header";
			headerValue = "someValue";
		});

		after((done) => {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should set the header on the response", done => {
			callback = (request, response) => {
				response.set(headerKey, headerValue);
				response.get(headerKey).should.equal(headerValue);
				response.json(data);
			};

			router = new Router(options);
			router.get(path, callback);
			router.listen(portNumber, () => {
				Request.get
					.url(url)
					.results((error, response) => {
						done();
					});
			});
		});
	});

	describe("response.status(statusCode)", () => {
		let path,
			callback,
			url,
			data;

		beforeEach((done) => {
			path = "/sagan";
			url = `${host}${path}`;
			data = {name: "Bob Belcher", age: 46};

			callback = (request, response) => {
				response.json(data);
			};

			router = new Router(options);
			router.get(path, callback);
			router.listen(portNumber, done);
		});

		afterEach((done) => {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should allow chaining", () => {
			response.status(500).should.equal(response);
		});

		it("should respond with the designated status code withouth chaining", done => {
			Request.get
				.url(url)
				.results((error, response) => {
					response.status.should.eql(200);
					done();
				});
		});
	});

	describe("response.end()", () => {
		let path,
			callback,
			url,
			data;

		before((done) => {
			path = "/sagan";
			url = `${host}${path}`;
			data = "This is a raw message";

			callback = (request, response) => response.end(data);

			router = new Router(options);
			router.get(path, callback);
			router.listen(portNumber, done);
		});

		after((done) => {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should respond with raw data", done => {
			Request.get
				.url(url)
				.results((error, response) => {
					response.body.should.eql(data);
					done();
				});
		});
	});

	describe("(http semanthics)", () => {
		let path,
			callback,
			url,
			data;

		before(() => {
			path = "/sagan";
			url = `${host}${path}`;
			data = {name: "Bob Belcher", age: 46};
		});

		describe("(dynamic functions)", () => {
			//camel cased names from the w3c specification names
			//http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
			let statuses = require("../http.statuses.json");

			statuses.forEach((status) => {
				it(`should load the ${status.name} status as a member into the response`, () => {
					response.should.have.property(status.name);
				});

				it(`should load the ${status.name} status into the object as a function`, () => {
					(typeof response[status.name]).should.equal("function");
				});

				describe(`response.${status.name}()`, () => {

					before(done => {
						callback = (request, response) => response[status.name](data);

						router = new Router(options);
						router.get(path, callback);
						router.listen(portNumber, done);
					});

					after((done) => {
						router.close(done);
					});

					it(`should call response.status with ${status.code}`, done => {
						Request.get
							.url(url)
							.results((error, response) => {
								response.status.should.eql(status.code);
								done();
							});
					});
				});
			});
		});
	});

	xdescribe("response.download()", () => {
		let path,
			callback,
			url,
			data;

		before((done) => {
			path = "/trig.png";
			url = `${host}${path}`;
			data = "This is a raw message";

			callback = (request, response) => {
				response.download(data);
			}

			router = new Router(options);

			router.static("trig.png");

			router.get(path, callback);
			router.listen(portNumber, done);
		});

		after((done) => {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should respond with json data", done => {
			Request.get
				.url(url)
				.header("Content-Type", "application/vnd.api+json")
				.results((error, response) => {
					response.body.should.eql(data);
					done();
				});
		});
	});
});
