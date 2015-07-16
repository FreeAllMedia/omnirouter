import Router, {Route} from "../lib/router.js";

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
  });
});
