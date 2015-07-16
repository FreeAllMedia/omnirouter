"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libRouterJs = require("../lib/router.js");

var _libRouterJs2 = _interopRequireDefault(_libRouterJs);

var _appeal = require("appeal");

var _appeal2 = _interopRequireDefault(_appeal);

describe("Route", function () {
  describe("(methods)", function () {
    it("should have a then function", function () {
      new _libRouterJs.Route("/someroute").should.have.property("then");
    });

    it("should have a path propety after creating an instance", function () {
      new _libRouterJs.Route("/someroute").should.have.property("path");
    });

    it("should have a router propety after creating an instance", function () {
      new _libRouterJs.Route("/someroute", new _libRouterJs2["default"]()).should.have.property("router");
    });

    describe(".cast", function () {
      var route = undefined,
          router = undefined;
      beforeEach(function () {
        router = new _libRouterJs2["default"]();
        route = router.get("/someroute/:id");
      });

      it("should return an instance of Route", function () {
        route.cast("id", Number).should.be.instanceOf(_libRouterJs.Route);
      });

      it("should show throw if there is no matching parameter to cast on the route path", function () {
        (function () {
          route.cast("id1", Number);
        }).should["throw"]("Parameter not found in the route path.");
      });
    });
  });
});