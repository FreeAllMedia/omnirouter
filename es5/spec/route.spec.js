"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libRouterJs = require("../lib/router.js");

var _libRouterJs2 = _interopRequireDefault(_libRouterJs);

var _libRouteJs = require("../lib/route.js");

var _libRouteJs2 = _interopRequireDefault(_libRouteJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

describe("Route", function () {
	describe("(methods)", function () {
		it("should have a then function", function () {
			new _libRouteJs2["default"]("/someroute").should.have.property("then");
		});

		it("should have a path propety after creating an instance", function () {
			new _libRouteJs2["default"]("/someroute").should.have.property("path");
		});

		it("should have a router propety after creating an instance", function () {
			new _libRouteJs2["default"]("/someroute", new _libRouterJs2["default"]()).should.have.property("router");
		});

		describe(".cast", function () {
			var route = undefined,
			    router = undefined;
			beforeEach(function () {
				router = new _libRouterJs2["default"]();
				route = router.get("/someroute/:id");
			});

			it("should return an instance of Route", function () {
				route.cast("id", Number).should.be.instanceOf(_libRouteJs2["default"]);
			});

			it("should show throw if there is no matching parameter to cast on the route path", function () {
				(function () {
					route.cast("id1", Number);
				}).should["throw"]("Parameter id1 not found in the route path.");
			});
		});
	});

	describe("(before and after filters)", function () {
		var logRequestSpy = undefined,
		    route = undefined,
		    callbackSpy = undefined,
		    authorizeSpy = undefined,
		    mockRequest = undefined,
		    mockResponse = undefined,
		    clock = undefined,
		    callRouteCallback = undefined;

		before(function () {
			callRouteCallback = function (routeDefinition, callback) {
				_flowsync2["default"].series([function callbackAction(next) {
					mockResponse = {
						end: function end() {}
					};
					routeDefinition.handle(mockRequest, mockResponse);
					clock.tick(1000);
					next();
				}], callback);
			};
		});

		beforeEach(function () {
			route = new _libRouteJs2["default"]("put", "/bar");
			route.then(function (request, response) {
				callbackSpy(request, response);
			});
			clock = _sinon2["default"].useFakeTimers();

			/* FILTER SPIES */
			logRequestSpy = _sinon2["default"].spy(function logRequestSpyFc(request, response, next) {
				next();
			});

			route.logRequest = logRequestSpy;

			authorizeSpy = _sinon2["default"].spy(function authorizeSpyFc(request, response, next) {
				next();
			});

			route.authorize = authorizeSpy;

			/* ACTION SPIES */
			callbackSpy = _sinon2["default"].spy(function callbackSpyFc(request, response) {
				response.end();
			});

			mockRequest = {};

			mockResponse = {
				end: function end() {}
			};
		});

		afterEach(function () {
			clock.restore();
		});

		describe(".before(...options)", function () {
			describe("(with just a filter function)", function () {
				beforeEach(function () {
					route.before(route.logRequest);
				});

				describe("(before all)", function () {
					it("should call a filter method before create", function (done) {
						mockResponse = {
							end: function end() {
								_sinon2["default"].assert.callOrder(logRequestSpy, callbackSpy);
								done();
							}
						};
						route.handle(mockRequest, mockResponse);
					});
				});

				describe("(order)", function () {
					beforeEach(function () {
						route.before(route.authorize);
					});

					describe("(before all)", function () {
						it("should call a filter before create action in the order they were added", function (done) {
							mockResponse = {
								end: function end() {
									_sinon2["default"].assert.callOrder(logRequestSpy, authorizeSpy, callbackSpy);
									done();
								}
							};

							route.handle(mockRequest, mockResponse);
						});
					});
				});
			});
		});

		describe(".skip(...options)", function () {
			describe("(with just the filter)", function () {
				describe("(when was applied to all)", function () {
					beforeEach(function () {
						route.before(route.logRequest);
						route.skip(route.logRequest);
					});

					it("should skip a filter applied to all actions", function (done) {
						callRouteCallback(route, function () {
							logRequestSpy.called.should.be["false"];
							done();
						});
					});
				});
			});
		});
	});
});