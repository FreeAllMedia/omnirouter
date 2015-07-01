const loadDynamicMethods = Symbol();

export default class Response {
	constructor(expressResponse, middlewares) {
		Object.defineProperties(this, {
			"_response": {
				enumerable: false,
				value: expressResponse
			},
			"_middlewares": {
				enumerable: false,
				value: middlewares
			}
		});

		this[loadDynamicMethods]();
	}

	[loadDynamicMethods]() {
		const statuses = require("../../http.statuses.json");
		if(Array.isArray(statuses)) {
			statuses.forEach((status) => {
				this[status.name] = (data) => {
					//call hook for data format middleware in a pipeline
					this._middlewares.forEach((middleware) => {
						if(middleware.formatResponse && typeof middleware.formatResponse === "function" ) {
							middleware.formatResponse(this);
						}

						if(middleware.format && typeof middleware.format === "function" ) {
							data = middleware.format(data);
						}
					});

					this.status(status.code).send(data);
				};
			});
		}
	}

	end(message) {
		this._response.end(message);
	}

	status(code) {
		this._response.status(code);
		return this;
	}

	json(data) {
		this._response.json(data);
	}

	send(data) {
		this._response.send(data);
	}

	download(data) {
		this._response.download(data);
	}

	set(key, value) {
		this._response.set(key, value);
	}

	get(key) {
		return this._response.get(key);
	}
}
