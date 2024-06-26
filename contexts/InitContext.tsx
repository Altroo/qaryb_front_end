import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import {
	AppTokensCookieType, CartUniqueIDCookieType,
	InitStateInterface,
	InitStateToken,
	InitStateUniqueID, NewShopCookieType
} from "../types/_init/_initTypes";
import {
	initAppAction,
	initAppCookieTokensAction,
	initNewShopBorderIconAction
} from "../store/actions/_init/_initActions";
import { emptyInitStateToken, emptyInitStateUniqueID } from '../store/slices/_init/_initSlice';
import { shopGetRootAction } from '../store/actions/shop/shopActions';
import { accountGetCheckAccountAction } from '../store/actions/account/accountActions';
import { cookiesFetcher } from '../store/services/_init/_initAPI';
import {
	getCheckUserHasShop,
	getInitStateToken,
	getInitStateUniqueID,
	getTokenType,
	getUserShopUrl
} from "../store/selectors";
import { placesGetCitiesAction } from "../store/actions/places/placesActions";
import { notificationGetRootAction } from "../store/actions/notification/notificationActions";
import { cartGetCartCounterAction } from "../store/actions/cart/cartActions";
import { orderGetOrdersCountAction } from "../store/actions/order/orderActions";

const InitContext = createContext<InitStateInterface<InitStateToken, InitStateUniqueID>>({
	tokenType: null,
	initStateToken: emptyInitStateToken,
	initStateUniqueID: emptyInitStateUniqueID,
});

export const InitContextProvider = (props: PropsWithChildren<Record<string, unknown>>) => {
	const dispatch = useAppDispatch();
	const userHasShop = useAppSelector(getCheckUserHasShop);
	const userShopUrl = useAppSelector(getUserShopUrl);
	const tokenType = useAppSelector(getTokenType);
	const token = useAppSelector(getInitStateToken);
	const uniqueID = useAppSelector(getInitStateUniqueID);
	const [appTokenCookiesLoaded, setAppTokenCookiesLoaded] = useState<boolean>(false);
	const [newShopCookiesLoaded, setNewShopCookiesLoaded] = useState<boolean>(false);
	const [cartUniqueIDLoaded, setCartUniqueIDLoaded] = useState<boolean>(false);

	useEffect(() => {
		// init app tokens from cookies
		if (!appTokenCookiesLoaded) {
			cookiesFetcher('/cookies').then((value: { data: { cookies: AppTokensCookieType }; status: number }) => {
				if (value.status === 200) {
					dispatch(initAppCookieTokensAction(value.data.cookies));
					setAppTokenCookiesLoaded(true);
				}
			});
		}
		// init new shop border & icon_color from cookies
		if (!newShopCookiesLoaded) {
			cookiesFetcher('/cookies').then((value: {data: {cookies: NewShopCookieType}; status: number }) => {
				if (value.status === 200) {
					dispatch(initNewShopBorderIconAction(value.data.cookies));
					setNewShopCookiesLoaded(true);
				}
			});
		}
		// Init user cart with the unique_id
		if (!cartUniqueIDLoaded) {
			cookiesFetcher('/cookies').then((value: {data: {cookies: CartUniqueIDCookieType}; status: number}) => {
				if (value.status === 200 && value.data.cookies["@unique_id"]) {
					// dispatch(cartGetAllAction(value.data.cookies["@unique_id"]));
					dispatch(cartGetCartCounterAction(value.data.cookies["@unique_id"]));
					setCartUniqueIDLoaded(true);
				}
			});
		}
		// Initialise states
		dispatch(initAppAction());
		dispatch(placesGetCitiesAction('MA'));
		// case user didn't complete temporary shop creation
		// or refreshed the page in the middle of the process
		// dispatch(loadNewAddedShopAction());
		if (tokenType === 'TOKEN' && token !== null) {
			// moved to init Saga or in it's page. (in it's page causes infinite loop)
			// dispatch(accountGetProfilAction());
			// dispatch(cartGetAllAction());
			// Required by userHasShop
			dispatch(accountGetCheckAccountAction());
			if (userHasShop && typeof userShopUrl === 'string') {
				dispatch(shopGetRootAction(userShopUrl));
			}
			dispatch(orderGetOrdersCountAction());
			dispatch(notificationGetRootAction());
		}
		/*
		else if (tokenType === 'UNIQUE_ID' && uniqueID !== null) {
			// try to get unique ID shop if exists.
			dispatch(shopGetRootAction());
		}
		 */
	}, [appTokenCookiesLoaded, cartUniqueIDLoaded, dispatch, newShopCookiesLoaded, token, tokenType, userHasShop, userShopUrl]);

	const contextValue: InitStateInterface<InitStateToken, InitStateUniqueID> = {
		tokenType: tokenType,
		initStateToken: token,
		initStateUniqueID: uniqueID,
	};

	return <InitContext.Provider value={contextValue}>{props.children}</InitContext.Provider>;
};

export default InitContext;
