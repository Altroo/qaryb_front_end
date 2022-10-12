import {
	GlobalApiPromiseError,
	InitStateNonNullableToken,
	ResponseDataInterface,
	SagaCallBackBase
} from "../_init/_initTypes";
import { UserClass } from '../../models/account/UserClass';
import { FacebookClass, GoogleClass } from '../../models/account/SocialsClass';
import { CitiesType, CountriesType } from '../places/placesTypes';
import { NextRouter } from 'next/router';
import { accountPutChangeEmailHasPasswordAction } from "../../store/actions/account/accountActions";

export type AccountGenderType = 'M' | 'F';
export type AccountEncloseType = '' | 'A' | 'B';
export type AccountDeleteType = '' | 'A' | 'B';

export type AccountGenderCodeValueType = {
	code: 'M' | 'F';
	value: 'Homme' | 'Femme';
};

export type AccountCheckAccountType = {
	pk: number;
	first_name: string;
	last_name: string;
	email: string;
	verified: boolean;
	has_password: boolean;
	shop_url: string | boolean;
	has_shop: boolean;
	is_new: boolean;
	is_subscribed: boolean;
	is_creator: boolean;
	picture: string;
};

//!- Account State
export interface AccountStateInterface {
	// email: string | null,
	profil: UserClass | Record<string, unknown>;
	profilApi: GlobalApiPromiseError;
	selectedProfil: UserClass | Record<string, unknown>;
	socials: Array<GoogleClass | FacebookClass> | [];
	email_exists: boolean;
	isLoggedIn: boolean;
	blockedList: Array<AccountGetBlockType> | [];
	check_account: AccountCheckAccountType | Record<string, unknown>;
	check_accountApi: GlobalApiPromiseError;
	addresses: Array<AccountAddress>;
	selectedAddress: AccountAddress | Record<string, unknown>;
	verifiedAccount: boolean;
	verificationCodeSent: boolean;
	passwordChanged: boolean;
	passwordResetCodeSent: boolean;
	passwordResetValidCode: boolean;
	emailChanged: boolean;
}

type PayloadType = {
	type: string;
};

export interface AccountPostRegisterType extends PayloadType {
	email: string;
	password: string;
	password2: string;
	first_name: string;
	last_name: string;
}

export type AccountPostRegisterResponseType = ResponseDataInterface<InitStateNonNullableToken>;

export type AccountPostLoginType = Omit<AccountPostRegisterType, 'password2' | 'first_name' | 'last_name'>;

export type AccountPostLoginResponseType = AccountPostRegisterResponseType;

export type AccountGetProfilResponseType = ResponseDataInterface<UserClass>;

export type AccountPatchProfilResponseType = AccountGetProfilResponseType;

// export interface AccountPatchProfilType extends UserClass {
// 	type: string;
// }

export interface AccountPatchProfilType {
	type: string;
	avatar: string | ArrayBuffer | null;
	first_name: string;
	last_name: string;
	birth_date: string | null;
	gender: string;
	city: string | null;
	country: string | null;
}

export type AccountGetSocialsType = Array<GoogleClass | FacebookClass> | [];
export type AccountGetSocialsResponseType = ResponseDataInterface<AccountGetSocialsType>;

export type InitNonNullStateToken = {
	access_token: string;
	refresh_token: string;
	user: {
		pk: number;
		email: string;
		first_name: string;
		last_name: string;
	};
	access_token_expiration: string;
	refresh_token_expiration: string;
};

export type AccountPostFacebookResponseType = ResponseDataInterface<InitNonNullStateToken>;
export type AccountPostGoogleResponseType = ResponseDataInterface<InitNonNullStateToken>;

export type AccountGetBlockType = {
	pk: number;
	blocked_user_pk: number;
	blocked_user_first_name: string | null;
	blocked_user_last_name: string | null;
	blocked_user_avatar: string;
};

export type AccountBlockType = Array<AccountGetBlockType> | [];

export type AccountGetBlockResponseType = ResponseDataInterface<AccountBlockType>;
export type AccountPostBlockResponseType = ResponseDataInterface<AccountGetBlockType>;

export type AccountGetCheckAccountResponseType = ResponseDataInterface<AccountCheckAccountType>;

export type AccountAddress = {
	pk: number;
	title: string;
	first_name: string;
	last_name: string;
	address: string;
	city: CitiesType;
	country: CountriesType;
	phone: string;
	email: string;
};

export type AccountGetAddresses = Array<AccountAddress> | [];
export type AccountGetAddressesResponseType = ResponseDataInterface<AccountGetAddresses>;

export interface AccountPostAddressType extends Omit<AccountAddress, 'pk' | 'city' | 'country'> {
	type: string;
}

export interface AccountPostAddressInterface extends AccountPostAddressType {
	city: number;
	country: number;
}

export type AccountPostAddressResponseType = ResponseDataInterface<AccountAddress>;
export type AccountPatchAddressResponseType = AccountPostAddressResponseType;

export type AccountGetAddressResponseType = ResponseDataInterface<AccountAddress>;

export interface AccountPostEncloseAccountType extends PayloadType {
	reason_choice: AccountEncloseType;
	router: NextRouter;
	typed_reason?: string;
}

export interface AccountPostDeleteAccountType extends PayloadType {
	reason_choice: AccountDeleteType;
	router: NextRouter;
	typed_reason?: string;
}

export interface AccountPostVerifyAccountType extends PayloadType {
	email: string;
	code: string;
}

export interface AccountPutChangeEmailHasPasswordType {
	email: string;
}

export interface AccountPutChangeEmailHasPasswordSagaCallback extends SagaCallBackBase {
	data: AccountPutChangeEmailHasPasswordType,
}

export type AccountPutChangeEmailHasPasswordResponseType = ResponseDataInterface<AccountPutChangeEmailHasPasswordType>;