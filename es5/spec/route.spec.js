"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libRouterJs = require("../lib/router.js");

var _libRouterJs2 = _interopRequireDefault(_libRouterJs);

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
  });
});