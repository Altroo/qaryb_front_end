import { ShopFontNameType } from '../shop/shopTypes';
import { OfferPinType } from '../offer/offerTypes';

export type ApiErrorType = {
	status_code: number | null;
	message: string | null;
	details: Record<string, Array<string>> | { error: Array<string> } | null;
};

export type ApiErrorResponseType = {
	error: ApiErrorType;
};

export type ApiPromiseStatus = 'PENDING' | 'RESOLVED' | 'REJECTED' | null;

export type SagaCallBackBase = {
	error: ApiErrorResponseType;
	cancelled: boolean;
};

export interface SagaCallBackOnCompleteBoolType extends SagaCallBackBase {
	data: boolean;
}

export interface SagaCallBackOnCompleteStrType extends SagaCallBackBase {
	data: string;
}

export interface OfferPinSagaCallBackType extends SagaCallBackBase {
	data: OfferPinType;
}
// Global Saga callBackType
export interface SagaCallBackResponseType<T> extends SagaCallBackBase {
	data: T;
}

export interface GlobalApiPromiseError extends ApiErrorResponseType {
	isAddInProgress: boolean;
	isFetchInProgress: boolean;
	isDeleteInProgress: boolean;
	isEditInProgress: boolean;
	// Error inherited
	addPromiseStatus: ApiPromiseStatus;
	fetchPromiseStatus: ApiPromiseStatus;
	deletePromiseStatus: ApiPromiseStatus;
	editPromiseStatus: ApiPromiseStatus;
}

export interface ResponseDataInterface<T> {
	data: T;
	status: number;
}

export interface PaginationResponseType<T> {
	count: number;
	next: string | null;
	previous: string | null;
	results: Array<T>;
}

export interface ResponseDataErrorInterface {
	data: Record<string, unknown>;
	status: number;
}

export interface ResponseOnlyInterface {
	status: number;
}

export type APIContentTypeInterface = 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data';

export type Nullable<T> = { [K in keyof T]: T[K] | null };
// export type Undefinedable<T> = { [K in keyof T]: T[K] | undefined };
// export type DeepNullable<T> = { [K in keyof T]: DeepNullable<T[K]> | null };

export type TokenChoices = 'TOKEN' | 'UNIQUE_ID';

export type Token_type = {
	tokenType: TokenChoices | null;
};

export type InitStateNonNullableToken = {
	user: {
		pk: number;
		email: string;
		first_name: string;
		last_name: string;
	};
	access: string;
	refresh: string;
	access_expiration: string;
	refresh_expiration: string;
};

export type InitStateNonNullableTokenFixNextAuth = {
	id: number;
	user: {
		pk: number;
		email: string;
		first_name: string;
		last_name: string;
	};
	access: string;
	refresh: string;
	access_expiration: string;
	refresh_expiration: string;
};

export type tokenUser = {
	pk: number;
	email: string;
	first_name: string;
	last_name: string;
};
//!- Init State
export type InitStateToken = {
	user: {
		pk: number | null;
		email: string | null;
		first_name: string | null;
		last_name: string | null;
	};
	access: string | null;
	refresh: string | null;
	access_expiration: string | null;
	refresh_expiration: string | null;
};

export type InitStateUniqueID = {
	unique_id: string | null;
	unique_id_expiration: string | null;
};

export interface InitStateInterface<T, K> extends Token_type {
	initStateToken: T;
	initStateUniqueID: K;
	boutiqueCoupDeCoeur?: string | undefined;
}

type ResponseDataTokenRefresh = {
	access: string;
	refresh: string;
	access_expiration: string;
};

export type ResponseDataTokenRefreshType = ResponseDataInterface<ResponseDataTokenRefresh>;

export type IconColorType = 'black' | 'white';

export type AppTokensCookieType = {
	'@tokenType': string | undefined;
	'@initStateToken': string | undefined;
	'@initStateUniqueID': string | undefined;
};

export type NewShopCookieType = {
	'@shop_name': string | undefined;
	'@avatar': ArrayBuffer | string | undefined;
	'@color_code': string | undefined;
	'@bg_color_code': string | undefined;
	'@font_name': ShopFontNameType | undefined;
	'@border': string | undefined;
	'@icon_color': IconColorType | undefined;
};

export type CartUniqueIDCookieType = {
	'@unique_id': string | undefined;
}

export type AuthSagaContextType = {
	tokenType: TokenChoices;
	initStateToken: InitStateToken;
	initStateUniqueID: InitStateUniqueID;
};
