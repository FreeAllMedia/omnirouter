import EventEmitter from "events";
import flowsync from "flowsync";
import upcast from "upcast";
import privateData from "incognito";

const setupFilters = Symbol("setupFilters"),
        setupDynamicProperties = Symbol("setupDynamicProperties"),
        actionNames = Symbol("actionNames"),
        setupFilterProcessor = Symbol("setupFilterProcessor"),
        processFilters = Symbol("processFilters"),
        processBeforeFilters = Symbol("processBeforeFilters"),
        addFilter = Symbol("addFilter"),
        castCallback = Symbol("castCallback");

export default class Route extends EventEmitter {
	constructor(type, path, router) {
		super();
		this.setMaxListeners(0);
    const _ = privateData(this);
    _._casts = [];

		Object.defineProperties(this,
			{
				"type": {value: type},
				"path": {value: path},
				"router": {value: router},
				"callback": {value: null, writable: true}
			}
    );

    this[setupDynamicProperties]();
    this[setupFilters]();

    this.filters();
	}

	cast(parameterName, parameterType) {
		//TODO parameterName validation with path
		if(this.path.indexOf(`:${parameterName}`) < 0) {
			throw new Error(`Parameter ${parameterName} not found in the route path.`);
		}
		privateData(this)._casts.push({name: parameterName, type: parameterType});
		return this;
	}

    [castCallback](request, response, next) {
        privateData(this)._casts.forEach((cast) => {
            if(request && request.params[cast.name]) {
                let type = "string";
                switch(cast.type) {
                    case Number:
                        type = "number";
                        break;
                }
                request.params[cast.name] = upcast.to(request.params[cast.name], type);
            }
        });
        next();
    }

    filters() {
        this.before(this[castCallback]);
    }

	then(callback) {
    this.callback = callback;
		this.emit("callback", this.handle);
	}

    handle(...options) {
      return this.callback(...options);
    }

    /**
     * Set a function to be called before the specified action.
     * @method before
     */
    before(...options) {
        this[addFilter](this._filters.before, ...options);
    }

    skip(...options) {
        let filterToAvoid,
            actionsToAvoid;

        actionsToAvoid = [];
        filterToAvoid = options[0];

        this._filters.before.forEach(
            (filterDetails) => {
                if(filterDetails.filter === filterToAvoid && actionsToAvoid.length === 0) {
                    filterDetails.skip = true;
                } else {
                    actionsToAvoid.forEach(
                        (actionToAvoid) => {
                            if(filterDetails.filter === filterToAvoid
                                && filterDetails.action === actionToAvoid) {
                                filterDetails.skip = true;
                            }
                        },
                        this
                    );
                }
            },
            this
        );
    }

    /* Private Methods */
    [addFilter](owner, ...options) {
        const filter = options[0];
        // Filter to run before all actions, no skip available
        this.actionNames.forEach((actionName) => {
            owner.push({
                action: this[actionName],
                filter: filter
            });
        }, this);
    }

    [setupDynamicProperties]() {
        Object.defineProperties(
            this,
            {
                "actionNames": {
                    get: this[actionNames]
                }
            }
        );
    }

    [setupFilters]() {
        Object.defineProperties(
            this,
            {
                "_filters": {
                    writable: true,
                    enumerable: false,
                    value: {
                        before: []
                    }
                }
            }
        );

        this.actionNames.forEach(this[setupFilterProcessor], this);
    }

    [setupFilterProcessor](actionName) {
        const originalAction = this[actionName];
        const self = this;

        this[actionName] = (request, response) => {
            const originalEnd = response.end;
            flowsync.series([
                function beforeFilters(next) {
                    self[processBeforeFilters](
                        actionName,
                        request,
                        response,
                        next
                    );
                },
                function action(next) {
                    response.end = (...args) => {
                        originalEnd.apply(response, args);
                        next();
                    };
                    originalAction.apply(self, [request, response]);
                }
            ]);
        };

    }

    [processFilters](filters, request, response, callback) {
        const self = this;
        flowsync.eachSeries(
            filters,
            function processFilter(filterDetails, next) {
                //call filter if not skipped
                if(filterDetails.skip !== true) {
                    filterDetails.filter.apply(self, [request, response, next]);
                } else {
                    next();
                }
            },
            function finalizeFilters(errors, results) {
                callback(errors, results);
            }
        );
    }

    [processBeforeFilters](action, request, response, callback) {
        const applicableFilters = this._filters.before.filter((filter) => {
            return filter.action === this[action];
        });
        this[processFilters](applicableFilters, request, response, callback);
    }

    [actionNames]() {
        return ["handle"];
    }
}
