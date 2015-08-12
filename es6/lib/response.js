import privateData from "incognito";

const loadDynamicMethods = Symbol();

export default class Response {
	constructor(expressResponse, middlewares) {
		const _ = privateData(this);
		_._response = expressResponse;
		_._middlewares = middlewares;

		this[loadDynamicMethods]();
	}

	[loadDynamicMethods]() {
		const _ = privateData(this);
		const statuses = require("../../http.statuses.json");
		if(Array.isArray(statuses)) {
			statuses.forEach((status) => {
				this[status.name] = (data) => {
					//call hook for data format middleware in a pipeline
					_._middlewares.forEach((middleware) => {
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
		privateData(this)._response.end(message);
	}

	status(code) {
		privateData(this)._response.status(code);
		return this;
	}

	json(data) {
		privateData(this)._response.json(data);
	}

	send(data) {
		privateData(this)._response.send(data);
	}

	download(data) {
		privateData(this)._response.download(data);
	}

	set(key, value) {
		privateData(this)._response.set(key, value);
	}

	get(key) {
		return privateData(this)._response.get(key);
	}
}
