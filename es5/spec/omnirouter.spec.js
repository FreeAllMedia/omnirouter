"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libOmnirouterJs = require("../lib/omnirouter.js");

var _libOmnirouterJs2 = _interopRequireDefault(_libOmnirouterJs);

describe("Omnirouter", function () {
	var component = undefined;

	before(function () {
		component = new _libOmnirouterJs2["default"]();
	});

	it("should say something", function () {
		component.saySomething().should.equal("Something");
	});
});