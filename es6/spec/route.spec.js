import Router from "../lib/router.js";
import Route from "../lib/route.js";
import sinon from "sinon";
import flowsync from "flowsync";

describe("Route", () => {
  describe("(methods)", () => {
    it("should have a then function", () => {
      (new Route("/someroute")).should.have.property("then");
    });

    it("should have a path propety after creating an instance", () => {
      (new Route("/someroute")).should.have.property("path");
    });

    it("should have a router propety after creating an instance", () => {
      (new Route("/someroute", new Router())).should.have.property("router");
    });

    describe(".cast", () => {
      let route,
        router;
      beforeEach(() => {
        router = new Router();
        route = router.get("/someroute/:id");
      });

      it("should return an instance of Route", () => {
        route.cast("id", Number).should.be.instanceOf(Route);
      });

      it("should show throw if there is no matching parameter to cast on the route path", () => {
        () => {
          route.cast("id1", Number);
        }.should.throw("Parameter id1 not found in the route path.");
      });
    });
  });

  describe("(before and after filters)", () => {
		let logRequestSpy,
			route,
			callbackSpy,
      authorizeSpy,
			mockRequest,
			mockResponse,
			clock,
			callRouteCallback;

		before(() => {
			callRouteCallback = (routeDefinition, callback) => {
				flowsync.series([
					function callbackAction(next) {
						mockResponse = {
							end: () => {
							}
						};
						routeDefinition.handle(mockRequest, mockResponse);
						clock.tick(1000);
						next();
					}],
					callback
				);
			};
		});

		beforeEach(() => {
      route = new Route("put", "/bar");
      route.then((request, response) => {
        callbackSpy(request, response);
      });
			clock = sinon.useFakeTimers();

			/* FILTER SPIES */
			logRequestSpy = sinon.spy(function logRequestSpyFc(request, response, next) {
				next();
			});

      route.logRequest = logRequestSpy;

			authorizeSpy = sinon.spy(function authorizeSpyFc(request, response, next) {
				next();
			});

      route.authorize = authorizeSpy;

			/* ACTION SPIES */
			callbackSpy = sinon.spy(function callbackSpyFc(request, response) {
				response.end();
			});

			mockRequest = {};

			mockResponse = {
				end: () => {
				}
			};
		});

		afterEach(() => {
			clock.restore();
		});

		describe(".before(...options)", () => {
			describe("(with just a filter function)", () => {
				beforeEach(() => {
					route.before(route.logRequest);
				});

				describe("(before all)", () => {
					it("should call a filter method before create", done => {
						mockResponse = {
							end: () => {
								sinon.assert.callOrder(logRequestSpy, callbackSpy);
								done();
							}
						};
						route.handle(mockRequest, mockResponse);
					});
				});

				describe("(order)", () => {
					beforeEach(() => {
						route.before(route.authorize);
					});

					describe("(before all)", () => {
						it("should call a filter before create action in the order they were added", done => {
							mockResponse = {
								end: () => {
									sinon.assert.callOrder(
										logRequestSpy,
										authorizeSpy,
										callbackSpy);
									done();
								}
							};

							route.handle(mockRequest, mockResponse);
						});
					});
				});
			});
		});

		describe(".skip(...options)", () => {
			describe("(with just the filter)", () => {
				describe("(when was applied to all)", () => {
					beforeEach(() => {
						route.before(route.logRequest);
						route.skip(route.logRequest);
					});

					it("should skip a filter applied to all actions", done => {
						callRouteCallback(
							route,
							() => {
								logRequestSpy.called.should.be.false;
								done();
							}
						);
					});
				});
			});
		});
	});
});
