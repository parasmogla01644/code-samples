import _ from 'lodash';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { modelReducers } from '../models';
import { organismsReducers } from '../organisms';
import { Pages } from '../pages';
let store;

export const createReducer = () => {
	const reducers = _.reduce(
		_.flatten(_.compact(_.map(_.flatten(Pages), ({ importReducer }) => importReducer && importReducer()))),
		(value, { name, reducer }) => {
			return { ...value, [name]: reducer };
		},
		{}
	);

	const modelReducersProcessed = {};

	for (const reducer of modelReducers) {
		modelReducersProcessed[reducer.name] = reducer.reducer;
	}

	const organismsReducersProcessed = {};

	for (const reducer of organismsReducers) {
		organismsReducersProcessed[reducer.name] = reducer.reducer;
	}

	return combineReducers({
		...reducers,
		...modelReducersProcessed,
		...organismsReducersProcessed
	});
};

export const getStore = () => {
	return store;
};

export const getState = () => {
	return store.getState();
};

export const getDispatch = () => {
	return store.dispatch;
};

window.$state = {
	getState
};
