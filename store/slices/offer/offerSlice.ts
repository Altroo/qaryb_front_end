import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	OfferCategoriesType,
	OfferDeliveries, OfferGetMyOffersProductInterface, OfferGetMyOffersServiceInterface,
	OfferGetRootProductInterface,
	OfferGetRootServiceInterface, OfferGetVuesType,
	OfferProductInterface,
	OfferProductLocalisation,
	OfferServiceInterface,
	OfferServiceLocalisation, OfferSolderInterface,
	OfferStateInterface,
	OfferTagsType
} from "../../../types/offer/offerTypes";
import { PaginationResponseType } from '../../../types/_init/_initTypes';
// import { HYDRATE } from "next-redux-wrapper";

const initialState: OfferStateInterface = {
	userOffers: [],
	userOffersList: {
		next: null,
		previous: null,
		count: null,
		results: [],
	},
	offerVuesList: {
		next: null,
		previous: null,
		count: null,
		results: [],
		total_vues: null,
		this_month: null,
		pourcentage: null,
	},
	selectedOffer: {},
	selectedSolder: {},
	selectedTags: [],
	lastUsedLocalisation: {},
	lastUsedDeliveries: {},
	// local states
	userLocalOffer: {
		categoriesList: [],
	},
};

const OfferSlice = createSlice({
	name: 'offer',
	initialState: initialState,
	reducers: {
		appendPostOfferState: (state, action: PayloadAction<OfferProductInterface | OfferServiceInterface>) => {
			state.userOffers.push(action.payload);
			return state;
		},
		setSelectedOffer: (
			state,
			action: PayloadAction<OfferGetRootProductInterface | OfferGetRootServiceInterface>,
		) => {
			state.selectedOffer = action.payload;
			return state;
		},
		setSelectedOfferTags: (state, action: PayloadAction<OfferTagsType>) => {
			state.selectedTags = action.payload;
			return state;
		},
		setOfferLastUsedLocalisation: (state, action: PayloadAction<OfferProductLocalisation | OfferServiceLocalisation>) => {
			state.lastUsedLocalisation = action.payload;
			return state;
		},
		setOfferLastThreeUsedDeliveries: (state, action: PayloadAction<OfferDeliveries>) => {
			state.lastUsedDeliveries = action.payload.deliveries;
			return state;
		},
		setMyOffersList: (state, action: PayloadAction<PaginationResponseType<OfferGetMyOffersProductInterface | OfferGetMyOffersServiceInterface>>) => {
			const { next, previous, count, results } = action.payload;
			state.userOffersList.count = count;
			state.userOffersList.next = next;
			state.userOffersList.previous = previous;
			for(let i=0; i<results.length; i++){
				state.userOffersList.results.push(results[i]);
			}
			return state;
		},
		setPutOffer: (state, action: PayloadAction<OfferProductInterface | OfferServiceInterface>) => {
			const userOffersindex = state.userOffers.findIndex((item) => item.pk === action.payload.pk);
			if (userOffersindex >= 0){
				state.userOffers[userOffersindex] = action.payload;
			}
			const userOffersListIndex = state.userOffersList.results.findIndex((item) => item.pk === action.payload.pk);
			const updatedOffer = state.userOffersList.results[userOffersListIndex]
			if (userOffersListIndex >= 0){
				updatedOffer.title = action.payload.title;
				//*** thumbnail will be updated via ws
				// updatedOffer.thumbnail = action.payload.picture_1_thumb
				updatedOffer.price = action.payload.price;
				const detailsOffer = updatedOffer.details_offer;
				// check if it's a product
				if (action.payload.offer_type === 'V' &&
					'product_quantity' in detailsOffer &&
					'product_quantity' in action.payload) {
					detailsOffer.product_quantity = action.payload.product_quantity;
					detailsOffer.product_price_by = action.payload.product_price_by;
					detailsOffer.product_longitude = action.payload.product_longitude;
					detailsOffer.product_latitude = action.payload.product_latitude;
					detailsOffer.product_address = action.payload.product_address;
					detailsOffer.product_colors = action.payload.product_colors;
					detailsOffer.product_sizes = action.payload.product_sizes;
				// check if it's a service
				} else if (action.payload.offer_type === 'S' &&
					'service_availability_days' in detailsOffer &&
					'service_availability_days' in action.payload) {
					detailsOffer.service_availability_days = action.payload.service_availability_days;
					detailsOffer.service_morning_hour_from = action.payload.service_morning_hour_from;
					detailsOffer.service_morning_hour_to = action.payload.service_morning_hour_to;
					detailsOffer.service_afternoon_hour_from = action.payload.service_afternoon_hour_from;
					detailsOffer.service_afternoon_hour_to = action.payload.service_afternoon_hour_to;
					detailsOffer.service_zone_by = action.payload.service_zone_by;
					detailsOffer.service_price_by = action.payload.service_price_by;
					detailsOffer.service_longitude = action.payload.service_longitude;
					detailsOffer.service_latitude = action.payload.service_latitude;
					detailsOffer.service_address = action.payload.service_address;
					detailsOffer.service_km_radius = action.payload.service_km_radius;
				}
			}
			return state;
		},
		deleteUserOffer: (state, action: PayloadAction<{offer_pk: number}>) => {
			// update userOffers
			state.userOffers = state.userOffers.filter(item => item.pk !== action.payload.offer_pk);
			// update userOffersList results
			state.userOffersList.results = state.userOffersList.results.filter(item => item.pk !== action.payload.offer_pk);
			return state;
		},
		setSolderOffer: (state, action: PayloadAction<OfferSolderInterface>) => {
			// update userOffers
			const userOffersindex = state.userOffers.findIndex((item) => item.pk === action.payload.offer);
			if (userOffersindex >= 0){
				state.userOffers[userOffersindex].solder_type = action.payload.solder_type;
				state.userOffers[userOffersindex].solder_value = action.payload.solder_value;
			}
			// update userOffersList results
			const userOffersListIndex = state.userOffersList.results.findIndex((item) => item.pk === action.payload.offer);
			if (userOffersListIndex >= 0){
				state.userOffersList.results[userOffersListIndex].solder_type = action.payload.solder_type;
				state.userOffersList.results[userOffersListIndex].solder_value = action.payload.solder_value;
			}
			return state;
		},
		setGetSolderOffer: (state, action: PayloadAction<OfferSolderInterface>) => {
			state.selectedSolder = action.payload;
			return state;
		},
		deleteSolderOffer: (state, action: PayloadAction<{offer_pk: number}>) => {
			// update userOffers
			const userOffersindex = state.userOffers.findIndex((item) => item.pk === action.payload.offer_pk);
			if (userOffersindex >= 0){
				state.userOffers[userOffersindex].solder_type = null;
				state.userOffers[userOffersindex].solder_value = null;
			}
			// update userOffersList results
			const userOffersListIndex = state.userOffersList.results.findIndex((item) => item.pk === action.payload.offer_pk);
			if (userOffersListIndex >= 0){
				state.userOffersList.results[userOffersListIndex].solder_type = null;
				state.userOffersList.results[userOffersListIndex].solder_value = null;
			}
			//? update selectedSolder ?
			return state;
		},
		setOfferVuesList: (state, action: PayloadAction<OfferGetVuesType>) => {
			const { next, previous, count, results, total_vues, pourcentage, this_month } = action.payload;
			state.offerVuesList.count = count;
			state.offerVuesList.next = next;
			state.offerVuesList.previous = previous;
			state.offerVuesList.total_vues = total_vues;
			state.offerVuesList.pourcentage = pourcentage;
			state.offerVuesList.this_month = this_month;
			for(let i=0; i<results.length; i++){
				state.offerVuesList.results.push(results[i]);
			}
			return state;
		},
		setWSOfferThumbnail: (state, action: PayloadAction<{offer_pk: number, offer_thumbnail: string}>) => {
			const userOffersindex = state.userOffers.findIndex((item) => item.pk === action.payload.offer_pk);
			if (userOffersindex >= 0){
				state.userOffers[userOffersindex].picture_1_thumb = action.payload.offer_thumbnail;
			}
			const userOffersListIndex = state.userOffersList.results.findIndex((item) => item.pk === action.payload.offer_pk);
			if (userOffersListIndex >= 0) {
				state.userOffersList.results[userOffersListIndex].thumbnail = action.payload.offer_thumbnail;
			}
			if (state.selectedOffer.pk === action.payload.offer_pk) {
				state.selectedOffer.picture_1_thumb = action.payload.offer_thumbnail;
			}
			return state;
		},
		setExistsInCart: (state, action: PayloadAction<{offer_pk: number, exists_in_cart: boolean}>) => {
			if (state.selectedOffer.pk === action.payload.offer_pk) {
				state.selectedOffer.exists_in_cart = action.payload.exists_in_cart;
			}
			return state;
		},
		setLocalOfferCategories: (state, action: PayloadAction<OfferCategoriesType>) => {
			if (!state.userLocalOffer.categoriesList.includes(action.payload)) {
				state.userLocalOffer.categoriesList.push(action.payload);
			} else {
				const index = state.userLocalOffer.categoriesList.indexOf(action.payload);
				if (index !== -1) {
					state.userLocalOffer.categoriesList.splice(index, 1);
				}
			}
			return state;
		},
		initOffer: () => {
			return initialState;
		},
	},
	// extraReducers: {
	// 	[HYDRATE]: (state, action) => {
	// 		return { ...state, ...action.payload.offer };
	// 	},
	// },
});

export const {
	appendPostOfferState,
	setSelectedOffer,
	setSelectedOfferTags,
	setOfferLastUsedLocalisation,
	setOfferLastThreeUsedDeliveries,
	setMyOffersList,
	setPutOffer,
	deleteUserOffer,
	setSolderOffer,
	setGetSolderOffer,
	deleteSolderOffer,
	setOfferVuesList,
	initOffer,
	setWSOfferThumbnail,
	setExistsInCart,
	setLocalOfferCategories,
} = OfferSlice.actions;

export default OfferSlice.reducer;