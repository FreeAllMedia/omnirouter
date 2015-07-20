import Router, {Route} from "../lib/router.js";
import Request from "appeal";

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
});
