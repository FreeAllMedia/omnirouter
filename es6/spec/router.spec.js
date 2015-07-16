let sinon = require("sinon");

import Router, {Request, Route} from "../lib/router.js";
import Response from "../lib/response.js";

import HttpRequest from "appeal";

import JsonApiFormatter from "jsonapi-formatter";

describe("Router(...options)", () => {
	let router,
		options,
		portNumber,
		host,
		url,
		server;

	before(() => {
		// This is where the server we"re testing will be.
		portNumber = 3014;
		host = `http:\/\/localhost:${portNumber}`;

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

	describe(".initialize()", () => {
		let initializeSpy;

		class UserRouter extends Router {
			initialize(...options) {
				initializeSpy(...options);
			}
		}

		beforeEach(() => {
			initializeSpy = sinon.spy();
		});

		it("should be called after instantiation", () => {
			let userRouter = new UserRouter();
			initializeSpy.called.should.be.true;
		});

		it("should be called with the options provided to the constructor", () => {
			let userRouter = new UserRouter(options);
			initializeSpy.firstCall.args[0].should.eql(options);
		});

	});

	describe("Request(expressLikeRequest)", () => {
		describe("request.header(headerName)", () => {
			let mockExpressRequest,
				headers;

			before(() => {
				headers = {
					"Api-Key": "SomeApiKey"
				};
				mockExpressRequest = {
					get: (headerName) => {
						return headers[headerName];
					}
				};
			});

			it("should get the header by name", () => {
				const request = new Request(mockExpressRequest);
				request.header('Api-Key').should.equal(headers['Api-Key']);
			});
		});

		describe("request.body", () => {
			let mockExpressRequest,
				mockExpressNoMiddlewareRequest,
				headers;

			before(() => {
				headers = {
					"Api-Key": "SomeApiKey"
				};
				mockExpressRequest = {
					body: {"this": "should not throw an error"}
				};
				mockExpressNoMiddlewareRequest = {
					body: "{'this': 'should throw an error'}"
				};
			});

			it("should return json data already parsed", () => {
				const request = new Request(mockExpressRequest);
				request.body.should.eql(mockExpressRequest.body);
			});

			it("should error when json is passed unparsed", () => {
				(() => {
					const request = new Request(mockExpressNoMiddlewareRequest);
				}).should.throw("express JSON parsing middleware appears to be missing");
			});
		});

		describe('request.params', () => {
			let mockExpressRequest,
				params;

			before(() => {
				params = {id: 'someId'};
				mockExpressRequest = {
					params: params
				};
			});

			it('should get a parameter by name', () => {
				const request = new Request(mockExpressRequest);
				request.params.id.should.equal(params.id);
			});
		});
	});

	describe(".get(path, callback)", () => {
		let path,
			callback,
			url;

		before((done) => {
			path = "/spock";
			url = `${host}${path}`;

			callback = sinon.spy((request, response) => {
				response.end();
			});

			router = new Router(options);
			router.get(path, callback);
			router.listen(portNumber, done);
		});

		after((done) => {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should callback when the path is requested with GET", (done) => {
			HttpRequest.get
				.url(url)
				.results((error, response) => {
					callback.called.should.be.true;
					done();
				});
		});

		it("should callback with the request object", (done) => {
			HttpRequest.get
				.url(url)
				.results((error, response) => {
					callback.firstCall.args[0].should.be.instanceOf(Request);
					done();
				});
		});

		it("should callback with a response object", (done) => {
			HttpRequest.get
				.url(url)
				.results((error, response) => {
					callback.firstCall.args[1].should.be.instanceOf(Response);
					done();
				});
		});

		it("should respond without an X-Powered-By header", done => {
			HttpRequest
				.get
				.url(url)
				.results((error, response) => {
					(response.headers["x-powered-by"] === undefined).should.be.true;
					done();
				});
		});
	});

	describe(".post(path, callback)", () => {
		let path,
			callback,
			url;

		before((done) => {
			path = "/spork";
			url = `${host}${path}`;

			callback = sinon.spy((request, response) => {

				response.end();
			});

			router = new Router(options);
			router.post(path, callback);
			router.listen(portNumber, done);
		});

		after((done) => {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should callback when the path is requested with POST", (done) => {
			HttpRequest.post
				.url(url)
				.results((error, response) => {
					callback.called.should.be.true;
					done();
				});
		});

		it("should callback with the request object", (done) => {
			HttpRequest.post
				.url(url)
				.results((error, response) => {
					callback.firstCall.args[0].should.be.instanceOf(Request);
					done();
				});
		});

		it("should callback with a response object", (done) => {
			HttpRequest.post
				.url(url)
				.results((error, response) => {
					callback.firstCall.args[1].should.be.instanceOf(Response);
					done();
				});
		});
	});

	describe(".put(path, callback)", () => {
		let path,
			callback,
			url;

		before((done) => {
			path = "/spork";
			url = `${host}${path}`;

			callback = sinon.spy((request, response) => {

				response.end();
			});

			router = new Router(options);
			router.put(path, callback);
			router.listen(portNumber, done);
		});

		after((done) => {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should callback when the path is requested with PUT", (done) => {
			HttpRequest.put
				.url(url)
				.results((error, response) => {
					callback.called.should.be.true;
					done();
				});
		});

		it("should callback with the request object", (done) => {
			HttpRequest.put
				.url(url)
				.results((error, response) => {
					callback.firstCall.args[0].should.be.instanceOf(Request);
					done();
				});
		});

		it("should callback with a response object", (done) => {
			HttpRequest.put
				.url(url)
				.results((error, response) => {
					callback.firstCall.args[1].should.be.instanceOf(Response);
					done();
				});
		});
	});

	describe(".delete(path, callback)", () => {
		let path,
			callback,
			url;

		before((done) => {
			path = "/spork";
			url = `${host}${path}`;

			callback = sinon.spy((request, response) => {

				response.end();
			});

			router = new Router(options);
			router.delete(path, callback);
			router.listen(portNumber, done);
		});

		after((done) => {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should callback when the path is requested with DELETE", (done) => {
			HttpRequest.delete
				.url(url)
				.results((error, response) => {
					callback.called.should.be.true;
					done();
				});
		});

		it("should callback with the request object", (done) => {
			HttpRequest.delete
				.url(url)
				.results((error, response) => {
					callback.firstCall.args[0].should.be.instanceOf(Request);
					done();
				});
		});

		it("should callback with a response object", (done) => {
			HttpRequest.delete
				.url(url)
				.results((error, response) => {
					callback.firstCall.args[1].should.be.instanceOf(Response);
					done();
				});
		});
	});

	describe(".static(path, callback)", () => {
		let path,
			callback,
			url;

		before((done) => {
			path = "/spock";
			url = `${host}${path}`;

			callback = sinon.spy((request, response) => {
				response.end();
			});

			router = new Router(options);
			router.get(path, callback);
			router.listen(portNumber, done);
		});

		after((done) => {
			// We have to close the server after testing is complete
			// or else it will be left listening on the test port
			router.close(done);
		});

		it("should setup a GET request listener for ");

		it("should callback when the path is requested with GET", (done) => {
			HttpRequest.get
				.url(url)
				.results((error, response) => {
					callback.called.should.be.true;
					done();
				});
		});

		it("should callback with the request object", (done) => {
			HttpRequest.get
				.url(url)
				.results((error, response) => {
					callback.firstCall.args[0].should.be.instanceOf(Request);
					done();
				});
		});

		it("should callback with a response object", (done) => {
			HttpRequest.get
				.url(url)
				.results((error, response) => {
					callback.firstCall.args[1].should.be.instanceOf(Response);
					done();
				});
		});
	});

	describe("(chaining)", () => {
		describe(".get", () => {
			let route,
				path,
				url,
				callback;

			before(done => {
				router = new Router();
				callback = sinon.spy((request, response) => {
					response.end();
				});
				path = "/chained-spock";
				url = `${host}${path}`;
				route = router.get(path);
				route.then(callback);
				router.listen(portNumber, done);
			});

			after(done => {
				router.close(done);
			});

			it("should return a Route instance", () => {
				route.should.be.instanceOf(Route);
			});

			it("should callback", done => {
				HttpRequest.get
					.url(url)
					.results(() => {
						callback.called.should.be.true;
						done();
					});
			});
		});

		describe(".post", () => {
			let route,
				path,
				url,
				callback;

			before(done => {
				router = new Router();
				callback = sinon.spy((request, response) => {
					response.end();
				});
				path = "/chained-spock";
				url = `${host}${path}`;
				route = router.post(path);
				route.then(callback);
				router.listen(portNumber, done);
			});

			after(done => {
				router.close(done);
			});

			it("should return a Route instance", () => {
				route.should.be.instanceOf(Route);
			});

			it("should callback", done => {
				HttpRequest.post
					.url(url)
					.results(() => {
						callback.called.should.be.true;
						done();
					});
			});
		});

		describe(".put", () => {
			let route,
				path,
				url,
				callback;

			before(done => {
				router = new Router();
				callback = sinon.spy((request, response) => {
					response.end();
				});
				path = "/chained-spock";
				url = `${host}${path}`;
				route = router.put(path);
				route.then(callback);
				router.listen(portNumber, done);
			});

			after(done => {
				router.close(done);
			});

			it("should return a Route instance", () => {
				route.should.be.instanceOf(Route);
			});

			it("should callback", done => {
				HttpRequest.put
					.url(url)
					.results(() => {
						callback.called.should.be.true;
						done();
					});
			});
		});

		describe(".delete", () => {
			let route,
				path,
				url,
				callback;

			before(done => {
				router = new Router();
				callback = sinon.spy((request, response) => {
					response.end();
				});
				path = "/chained-spock";
				url = `${host}${path}`;
				route = router.delete(path);
				route.then(callback);
				router.listen(portNumber, done);
			});

			after(done => {
				router.close(done);
			});

			it("should return a Route instance", () => {
				route.should.be.instanceOf(Route);
			});

			it("should callback", done => {
				HttpRequest.delete
					.url(url)
					.results(() => {
						callback.called.should.be.true;
						done();
					});
			});
		});
	});

	describe("(middleware)", () => {
		describe(".use(middleware)", () => {
			let path,
			callback,
			url,
			data;

			before(() => {
				path = "/sagan";
				url = `${host}${path}`;
			});

			it("should push every semanthic method through the formater middleware", () => {
				//camel cased names from the w3c specification names
				//http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
				let statuses = require("../../http.statuses.json");
				describe("(jsonapi-formatter middleware)", () => {
					statuses.forEach((status) => {
						describe(`response.${status.name}()`, () => {

							if(status.code >= 300) {
								describe("(with an error instance)", () => {
									before(done => {
										data = new Error("some error data");
										callback = (request, response) => response[status.name](data);

										router = new Router(options);
										router.get(path, callback);
										//inject middleware
										router.use(JsonApiFormatter);
										router.listen(portNumber, done);
									});

									after((done) => {
										// We have to close the server after testing is complete
										// or else it will be left listening on the test port
										router.close(done);
									});

									it(`should respond with the given error under a jsonapi envelope using the plugin`, done => {
										HttpRequest
											.get
											.url(url)
											.header("content-type", "application/vnd.api+json; charset=utf-8")
											.results((error, response) => {
												response.body.should.eql({errors: [{title: data.name, details: data.message}]});
												done();
											});
									});
								});

								describe("(with an error array)", () => {
									before(done => {
										data = new Error("some error data");
										callback = (request, response) => response[status.name]([data]);

										router = new Router(options);
										router.get(path, callback);
										//inject middleware
										router.use(JsonApiFormatter);
										router.listen(portNumber, done);
									});

									after((done) => {
										// We have to close the server after testing is complete
										// or else it will be left listening on the test port
										router.close(done);
									});

									it(`should response with the given error array under a jsonapi envelope using the plugin`, done => {
										HttpRequest
											.get
											.url(url)
											.header("content-type", "application/vnd.api+json; charset=utf-8")
											.results((error, response) => {
												response.body.should.eql({errors: [{title: data.name, details: data.message}]});
												done();
											});
									});
								});
							} else {
								describe("(with a bunch of data)", () => {
									before(done => {
										data = {name: "Bob Belcher", age: 46};
										callback = (request, response) => response[status.name](data);

										router = new Router(options);
										router.get(path, callback);
										router.use(JsonApiFormatter);
										router.listen(portNumber, done);
									});

									after((done) => {
										// We have to close the server after testing is complete
										// or else it will be left listening on the test port
										router.close(done);
									});

									it(`should respond with the given data under a jsonapi envelope using the plugin`, done => {
										HttpRequest
											.get
											.url(url)
											.header("content-type", "application/vnd.api+json")
											.results((error, response) => {
												if(response.body) {
													response.body.should.eql({data: data});
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
