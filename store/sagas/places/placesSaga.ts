import { call, put, takeLatest } from 'redux-saga/effects';
import * as Types from '../../actions';
import { allowAnyInstance } from '../../../utils/helpers';
import { getApi } from '../../services/_init/_initAPI';
import {
	setGetLocalisation, setGetCities, setGetCountries,
	setGetPlacesIsLoading, placesGETApiErrorAction,
} from "../../slices/places/placesSlice";
import { ApiErrorResponseType } from '../../../types/_init/_initTypes';
import {
	PlacesGetCitiesResponseType,
	PlacesGetCountriesResponseType,
	PlacesGetLocalisationResponseType
} from "../../../types/places/placesTypes";
import { AxiosInstance } from "axios";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

function* placesGetLocalisationSaga(payload: { type: string; longitude: number; latitude: number }) {
	yield put(setGetPlacesIsLoading());
	const url = `${process.env.NEXT_PUBLIC_PLACES_LOCALISATION}${payload.longitude}/${payload.latitude}/`;
	try {
		const instance : AxiosInstance = yield call(() => allowAnyInstance());
		const response: PlacesGetLocalisationResponseType = yield call(() => getApi(url, instance));
		if (response.status === 200) {
			yield put(setGetLocalisation({ ...response.data }));
		}
	} catch (e) {
		const apiError = e as ApiErrorResponseType;
		yield put<ActionCreatorWithPayload<ApiErrorResponseType>>(yield call(() => placesGETApiErrorAction(apiError)));
	}
}

function* placesGetCountriesSaga() {
	const url = `${process.env.NEXT_PUBLIC_PLACES_COUNTRIES}`;
	const params = {all : true};
	try {
		const instance : AxiosInstance = yield call(() => allowAnyInstance());
		const response: PlacesGetCountriesResponseType = yield call(() => getApi(url, instance, params));
		if (response.status === 200) {
			yield put(setGetCountries(response.data));
		}
	} catch (e) {
		const errors = e as ApiErrorResponseType;
		console.log(errors);
	}
}

function* placesGetCitiesSaga(payload: { type: string; code: string; q?: string }) {
	const url = `${process.env.NEXT_PUBLIC_PLACES_CITIES}`;
	const params = {code : payload.code, q: payload.q};
	try {
		const instance : AxiosInstance = yield call(() => allowAnyInstance());
		const response: PlacesGetCitiesResponseType = yield call(() => getApi(url, instance, params));
		if (response.status === 200) {
			yield put(setGetCities(response.data));
		} else {
			console.log(response.status);
			console.log(response.data);
		}
	} catch (e) {
		const errors = e as ApiErrorResponseType;
		console.log(errors);
	}
}

export function* watchPlaces() {
	yield takeLatest(Types.PLACES_GET_LOCALISATION, placesGetLocalisationSaga);
	yield takeLatest(Types.PLACES_GET_COUNTRIES, placesGetCountriesSaga);
	yield takeLatest(Types.PLACES_GET_CITIES, placesGetCitiesSaga);
}
