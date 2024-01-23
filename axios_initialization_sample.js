import axios from 'axios';
import _ from 'lodash';
require('axios-debug-log');

export default class AxiosCall {
	constructor(props) {
		switch (typeof props) {
			case "object":
				this.INSTANCE = axios.create({
					baseURL: props.baseURL,
					timeout: (props.timeout ? props.timeout : 1000),
					data: props.data
				})
				break;
			default:
				console.error("Error: Malformed instantiation");
				break;
		}
	}

	setAuthorization(authString) {
		if (this.INSTANCE) {
			this.INSTANCE.defaults.headers.common['Authorization'] = authString;
			this.INSTANCE.defaults.headers.common['Cache-Control'] = 'no-cache';
			//'Cache-Control': 'no-cache'
		} else {
			console.error("ERROR: Cannot add authorization to undefined instance.");
		}
	}

	static get(url, config) {
		return axios.get(url, config);
	}

	get(url, config) {

		return this.INSTANCE.get(url, config);
	}

	static post(url, data, config) {
		return axios.post(url, data, config);
	}

	post(url, data, config) {
		return this.INSTANCE.post(url, data, config);
	}

	static delete(url, data, config) {
		return axios.delete(url, data, config);
	}

	static put(url, data, config) {
		return axios.put(url, data, config);
	}

	put(url, data, config) {
		return this.INSTANCE.put(url, data, config);
	}

	delete(url, data, config) {
		return this.INSTANCE.delete(url, data, config)
	}
}
