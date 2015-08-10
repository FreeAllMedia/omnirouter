"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

var _upcast = require("upcast");

var _upcast2 = _interopRequireDefault(_upcast);

var setupFilters = Symbol("setupFilters"),
    setupDynamicProperties = Symbol("setupDynamicProperties"),
    actionNames = Symbol("actionNames"),
    setupFilterProcessor = Symbol("setupFilterProcessor"),
    processFilters = Symbol("processFilters"),
    processBeforeFilters = Symbol("processBeforeFilters"),
    addFilter = Symbol("addFilter"),
    castCallback = Symbol("castCallback");

var Route = (function (_EventEmitter) {
    function Route(type, path, router) {
        _classCallCheck(this, Route);

        _get(Object.getPrototypeOf(Route.prototype), "constructor", this).call(this);
        this.setMaxListeners(0);
        Object.defineProperties(this, {
            "type": { value: type },
            "path": { value: path },
            "router": { value: router },
            "_casts": { value: [] },
            "callback": { value: null, writable: true }
        });

        this[setupDynamicProperties]();
        this[setupFilters]();

        this.filters();
    }

    _inherits(Route, _EventEmitter);

    _createClass(Route, [{
        key: "cast",
        value: function cast(parameterName, parameterType) {
            //TODO parameterName validation with path
            if (this.path.indexOf(":" + parameterName) < 0) {
                throw new Error("Parameter " + parameterName + " not found in the route path.");
            }
            this._casts.push({ name: parameterName, type: parameterType });
            return this;
        }
    }, {
        key: castCallback,
        value: function value(request, response, next) {
            this._casts.forEach(function (cast) {
                if (request && request.params[cast.name]) {
                    var type = "string";
                    switch (cast.type) {
                        case Number:
                            type = "number";
                            break;
                    }
                    request.params[cast.name] = _upcast2["default"].to(request.params[cast.name], type);
                }
            });
            next();
        }
    }, {
        key: "filters",
        value: function filters() {
            this.before(this[castCallback]);
        }
    }, {
        key: "then",
        value: function then(callback) {
            this.callback = callback;
            this.emit("callback", this.handle);
        }
    }, {
        key: "handle",
        value: function handle() {
            return this.callback.apply(this, arguments);
        }
    }, {
        key: "before",

        /**
         * Set a function to be called before the specified action.
         * @method before
         */
        value: function before() {
            for (var _len = arguments.length, options = Array(_len), _key = 0; _key < _len; _key++) {
                options[_key] = arguments[_key];
            }

            this[addFilter].apply(this, [this._filters.before].concat(options));
        }
    }, {
        key: "skip",
        value: function skip() {
            var _this = this;

            var filterToAvoid = undefined,
                actionsToAvoid = undefined;

            actionsToAvoid = [];
            filterToAvoid = arguments[0];

            this._filters.before.forEach(function (filterDetails) {
                if (filterDetails.filter === filterToAvoid && actionsToAvoid.length === 0) {
                    filterDetails.skip = true;
                } else {
                    actionsToAvoid.forEach(function (actionToAvoid) {
                        if (filterDetails.filter === filterToAvoid && filterDetails.action === actionToAvoid) {
                            filterDetails.skip = true;
                        }
                    }, _this);
                }
            }, this);
        }
    }, {
        key: addFilter,

        /* Private Methods */
        value: function value(owner) {
            var _this2 = this;

            var filter = arguments[1];
            // Filter to run before all actions, no skip available
            this.actionNames.forEach(function (actionName) {
                owner.push({
                    action: _this2[actionName],
                    filter: filter
                });
            }, this);
        }
    }, {
        key: setupDynamicProperties,
        value: function value() {
            Object.defineProperties(this, {
                "actionNames": {
                    get: this[actionNames]
                }
            });
        }
    }, {
        key: setupFilters,
        value: function value() {
            Object.defineProperties(this, {
                "_filters": {
                    writable: true,
                    enumerable: false,
                    value: {
                        before: []
                    }
                }
            });

            this.actionNames.forEach(this[setupFilterProcessor], this);
        }
    }, {
        key: setupFilterProcessor,
        value: function value(actionName) {
            var originalAction = this[actionName];
            var self = this;

            this[actionName] = function (request, response) {
                var originalEnd = response.end;
                _flowsync2["default"].series([function beforeFilters(next) {
                    self[processBeforeFilters](actionName, request, response, next);
                }, function action(next) {
                    response.end = function () {
                        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                            args[_key2] = arguments[_key2];
                        }

                        originalEnd.apply(response, args);
                        next();
                    };
                    originalAction.apply(self, [request, response]);
                }]);
            };
        }
    }, {
        key: processFilters,
        value: function value(filters, request, response, callback) {
            var self = this;
            _flowsync2["default"].eachSeries(filters, function processFilter(filterDetails, next) {
                //call filter if not skipped
                if (filterDetails.skip !== true) {
                    filterDetails.filter.apply(self, [request, response, next]);
                } else {
                    next();
                }
            }, function finalizeFilters(errors, results) {
                callback(errors, results);
            });
        }
    }, {
        key: processBeforeFilters,
        value: function value(action, request, response, callback) {
            var _this3 = this;

            var applicableFilters = this._filters.before.filter(function (filter) {
                return filter.action === _this3[action];
            });
            this[processFilters](applicableFilters, request, response, callback);
        }
    }, {
        key: actionNames,
        value: function value() {
            return ["handle"];
        }
    }]);

    return Route;
})(_events2["default"]);

exports["default"] = Route;
module.exports = exports["default"];