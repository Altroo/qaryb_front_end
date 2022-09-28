// Initialise the APP
export const INIT_APP = 'INIT_APP';
export const INIT_NEW_SHOP_STATE = 'INIT_NEW_SHOP_STATE';
export const INIT_APP_COOKIE_TOKENS = 'INIT_APP_COOKIE_TOKENS';
export const REFRESH_APP_TOKEN_STATES = 'REFRESH_APP_TOKEN_STATES';
export const INIT_COOKIE_BORDER_ICON = 'INIT_COOKIE_BORDER_ICON';
// Account [Has no root]
export const ACCOUNT_SET_LOCAL_PICKED_EMAIL = 'ACCOUNT_SET_LOCAL_PICKED_EMAIL';
export const ACCOUNT_POST_FACEBOOK = 'ACCOUNT_POST_FACEBOOK';
export const ACCOUNT_SET_FACEBOOK_EMAIL = 'ACCOUNT_SET_FACEBOOK_EMAIL';
export const ACCOUNT_POST_GOOGLE = 'ACCOUNT_POST_GOOGLE';
export const ACCOUNT_POST_CHECK_EMAIL = 'ACCOUNT_POST_CHECK_EMAIL';
export const ACCOUNT_POST_LOGIN = 'ACCOUNT_POST_LOGIN';
export const ACCOUNT_GET_SOCIALS = 'ACCOUNT_GET_SOCIALS';
export const ACCOUNT_POST_LINK_FACEBOOK = 'ACCOUNT_POST_LINK_FACEBOOK';
export const ACCOUNT_POST_LINK_GOOGLE = 'ACCOUNT_POST_LINK_GOOGLE';
export const ACCOUNT_POST_UNLINK_SOCIAL = 'ACCOUNT_POST_UNLINK_SOCIAL';
export const ACCOUNT_POST_LOGOUT = 'ACCOUNT_POST_LOGOUT';
export const ACCOUNT_POST_REGISTER = 'ACCOUNT_POST_REGISTER';
export const ACCOUNT_POST_VERIFY_ACCOUNT = 'ACCOUNT_POST_VERIFY_ACCOUNT';
export const ACCOUNT_POST_RESEND_VERIFICATION = 'ACCOUNT_POST_RESEND_VERIFICATION';
export const ACCOUNT_POST_PASSWORD_CHANGE = 'ACCOUNT_POST_PASSWORD_CHANGE';
export const ACCOUNT_POST_SEND_PASSWORD_RESET = 'ACCOUNT_POST_SEND_PASSWORD_RESET';
export const ACCOUNT_GET_PASSWORD_RESET = 'ACCOUNT_GET_PASSWORD_RESET';
export const ACCOUNT_PUT_PASSWORD_RESET = 'ACCOUNT_PUT_PASSWORD_RESET';
export const ACCOUNT_POST_TOKEN_VERIFY = 'ACCOUNT_POST_TOKEN_VERIFY';
// export const ACCOUNT_POST_TOKEN_REFRESH = 'ACCOUNT_POST_TOKEN_REFRESH';
export const ACCOUNT_PATCH_PROFIL = 'ACCOUNT_PATCH_PROFIL';
export const ACCOUNT_GET_PROFIL = 'ACCOUNT_GET_PROFIL';
export const ACCOUNT_GET_SELECTED_PROFIL = 'ACCOUNT_GET_SELECTED_PROFIL';
export const ACCOUNT_GET_BLOCK = 'ACCOUNT_GET_BLOCK';
export const ACCOUNT_POST_BLOCK = 'ACCOUNT_POST_BLOCK';
export const ACCOUNT_DELETE_BLOCK = 'ACCOUNT_DELETE_BLOCK';
export const ACCOUNT_POST_REPORT = 'ACCOUNT_POST_REPORT';
export const ACCOUNT_POST_ADDRESS = 'ACCOUNT_POST_ADDRESS';
export const ACCOUNT_PATCH_ADDRESS = 'ACCOUNT_PATCH_ADDRESS';
export const ACCOUNT_DELETE_ADDRESS = 'ACCOUNT_DELETE_ADDRESS';
export const ACCOUNT_GET_ADDRESS = 'ACCOUNT_GET_ADDRESS';
export const ACCOUNT_GET_ADDRESSES = 'ACCOUNT_GET_ADDRESSES';
export const ACCOUNT_POST_ENCLOSE = 'ACCOUNT_POST_ENCLOSE';
export const ACCOUNT_PUT_CHANGE_EMAIL_HAS_PASSWORD = 'ACCOUNT_PUT_CHANGE_EMAIL_HAS_PASSWORD';
export const ACCOUNT_PUT_CHANGE_EMAIL_NOT_HAS_PASSWORD = 'ACCOUNT_PUT_CHANGE_EMAIL_NOT_HAS_PASSWORD';
export const ACCOUNT_GET_CHECK_ACCOUNT = 'ACCOUNT_GET_CHECK_ACCOUNT';
export const ACCOUNT_DELETE_ACCOUNT = 'ACCOUNT_DELETE_ACCOUNT';
// Shop
export const SHOP_GET_PHONE_CODES = 'SHOP_GET_PHONE_CODES';
export const SHOP_GET_PHONE_CODES_ERROR = 'SHOP_GET_PHONE_CODES_ERROR';
export const SHOP_POST_CREATOR = 'SHOP_POST_CREATOR';
export const SHOP_PATCH_PHONE_CONTACT = 'SHOP_PATCH_PHONE_CONTACT';
export const SHOP_PATCH_AVATAR = 'SHOP_PATCH_AVATAR';
export const SHOP_PATCH_SHOP_NAME = 'SHOP_PATCH_SHOP_NAME';
export const SHOP_PATCH_BIO = 'SHOP_PATCH_BIO';
export const SHOP_PATCH_AVAILABILITY = 'SHOP_PATCH_AVAILABILITY';
export const SHOP_PATCH_CONTACT = 'SHOP_PATCH_CONTACT';
export const SHOP_PATCH_ADDRESS = 'SHOP_PATCH_ADDRESS';
export const SHOP_PATCH_COLOR = 'SHOP_PATCH_COLOR';
export const SHOP_PATCH_FONT = 'SHOP_PATCH_FONT';
// export const SHOP_GET_QR_CODE = 'SHOP_GET_QR_CODE';
// export const SHOP_POST_QR_CODE = 'SHOP_POST_QR_CODE';
// export const SHOP_GET_VISIT_CARD = 'SHOP_GET_VISIT_CARD'; // [CANCELED]
// export const SHOP_POST_MODE_VACANCE = 'SHOP_POST_MODE_VACANCE';
// export const SHOP_DELETE_MODE_VACANCE = 'SHOP_DELETE_MODE_VACANCE';
// export const SHOP_PATCH_MODE_VACANCE = 'SHOP_PATCH_MODE_VACANCE';
// export const SHOP_GET_MODE_VACANCE = 'SHOP_GET_MODE_VACANCE';
export const SHOP_POST_ROOT = 'SHOP_POST_ROOT';
// export const SHOP_GET_ROOT_BY_SHOP_LINK = 'SHOP_GET_ROOT_BY_SHOP_LINK';
export const SHOP_GET_ROOT = 'SHOP_GET_ROOT';
// export const SHOP_POST_UNIQUE_ID_VERIFY = 'SHOP_POST_UNIQUE_ID_VERIFY';
export const SET_SHOP_NAME = 'SET_SHOP_NAME';
export const SET_SHOP_AVATAR = 'SET_SHOP_AVATAR';
export const SET_SHOP_COLOR = 'SET_SHOP_COLOR';
export const SET_SHOP_FONT = 'SET_SHOP_FONT';
export const SET_SHOP_BORDER = 'SET_SHOP_BORDER';
export const SET_SHOP_ICON_COLOR = 'SET_SHOP_ICON_COLOR';
export const LOAD_NEW_ADDED_SHOP_DATA = 'LOAD_NEW_ADDED_SHOP_DATA';
// Offer
export const OFFER_GET_TAGS = 'OFFER_GET_TAGS';
export const OFFER_GET_DELIVERIES = 'OFFER_GET_DELIVERIES';
export const OFFER_GET_LOCALISATION = 'OFFER_GET_LOCALISATION';
export const OFFER_GET_MY_OFFERS = 'OFFER_GET_MY_OFFERS';
export const OFFER_GET_MY_OFFERS_FIRST_PAGE = 'OFFER_GET_MY_OFFERS_FIRST_PAGE';
export const OFFER_POST_PIN = 'OFFER_POST_PIN';
export const OFFER_POST_SOLDER = 'OFFER_POST_SOLDER';
export const OFFER_PATCH_SOLDER = 'OFFER_PATCH_SOLDER';
export const OFFER_GET_SOLDER = 'OFFER_GET_SOLDER';
export const OFFER_DELETE_SOLDER = 'OFFER_DELETE_SOLDER';
// export const OFFER_POST_DUPLICATE = 'OFFER_POST_DUPLICATE';
export const OFFER_GET_VUES = 'OFFER_GET_VUES';
export const OFFER_POST_ROOT = 'OFFER_POST_ROOT';
export const OFFER_GET_ROOT = 'OFFER_GET_ROOT';
export const OFFER_GET_OFFERS_BY_SHOP_ID = 'OFFER_GET_OFFERS_BY_SHOP_ID';
export const OFFER_GET_OFFERS_BY_SHOP_ID_AND_QUERY_PARAMS = 'OFFER_GET_OFFERS_BY_SHOP_ID_AND_QUERY_PARAMS';
export const OFFER_GET_AVAILABLE_FILTERS_BY_SHOP_ID = 'OFFER_GET_AVAILABLE_FILTERS_BY_SHOP_ID';
export const OFFER_SET_EMPTY_SELECTED_OFFER = 'OFFER_SET_EMPTY_SELECTED_OFFER';
export const OFFER_PUT_ROOT = 'OFFER_PUT_ROOT';
export const OFFER_DELETE_ROOT = 'OFFER_DELETE_ROOT';
// Offer local states
export const SET_OFFER_CATEGORIES_PAGE = 'SET_OFFER_CATEGORIES_PAGE';
export const SET_OFFER_DESCRIPTION_PAGE = 'SET_OFFER_DESCRIPTION_PAGE';
export const SET_OFFER_PRICE_PAGE = 'SET_OFFER_PRICE_PAGE';
export const SET_OFFER_DELIVERY_PAGE_CLICK_AND_COLLECT = 'SET_OFFER_DELIVERY_PAGE_CLICK_AND_COLLECT';
export const SET_OFFER_DELIVERY_PAGE_DELIVERIES = 'SET_OFFER_DELIVERY_PAGE_DELIVERIES';
export const SET_OFFER_TO_EDIT = 'SET_OFFER_TO_EDIT';
export const EMPTY_OFFER_DELIVERY_CLICK_AND_COLLECT = 'EMPTY_OFFER_DELIVERY_CLICK_AND_COLLECT';
export const EMPTY_OFFER_DELIVERIES = 'EMPTY_OFFER_DELIVERIES';
export const EMPTY_OFFER_USER_LOCAL_OFFER = 'EMPTY_OFFER_USER_LOCAL_OFFER';
// Chat [Has no root]
export const CHAT_POST_MESSAGE = 'CHAT_POST_MESSAGE';
export const CHAT_POST_ARCHIVE = 'CHAT_POST_ARCHIVE';
export const CHAT_PATCH_MESSAGE = 'CHAT_PATCH_MESSAGE';
// endpoint use "/message" but left as "messages" here to specify it's a list of messages
export const CHAT_GET_MESSAGES = 'CHAT_GET_MESSAGES';
export const CHAT_GET_CONVERSATIONS = 'CHAT_GET_CONVERSATIONS';
// Cart
export const CART_POST_ORDER = 'CART_POST_ORDER';
export const CART_GET_ALL = 'CART_GET_ALL';
export const CART_GET_DETAILS = 'CART_GET_DETAILS';
export const CART_GET_COORDINATES = 'CART_GET_COORDINATES';
export const CART_POST_ROOT = 'CART_POST_ROOT';
export const CART_PATCH_ROOT = 'CART_PATCH_ROOT';
export const CART_DELETE_ROOT = 'CART_DELETE_ROOT';
// Order
export const ORDER_GET_BUYINGS = 'ORDER_GET_BUYINGS';
export const ORDER_GET_SELLINGS = 'ORDER_GET_SELLINGS';
export const ORDER_GET_DETAILS = 'ORDER_GET_DETAILS';
export const ORDER_POST_CANCEL_SELL = 'ORDER_POST_CANCEL_SELL';
export const ORDER_POST_CANCEL_BUY = 'ORDER_POST_CANCEL_BUY';
// Places
export const PLACES_GET_COUNTRIES = 'PLACES_GET_COUNTRIES';
export const PLACES_GET_CITIES = 'PLACES_GET_CITIES';
export const PLACES_GET_LOCALISATION = 'PLACES_GET_LOCALISATION';
// Version [will be applied later see : https://github.com/vercel/next.js/pull/34765]
export const VERSION_GET_ROOT = 'VERSION_GET_ROOT';
export const VERSION_GET_ROOT_ERROR = 'VERSION_GET_ROOT_ERROR';
export const PLACES_EMPTY_GET_LOCALISATION = 'PLACES_EMPTY_GET_LOCALISATION';
// WS Events
export const WS_MESSAGE_VIEWED = 'WS_MESSAGE_VIEWED';
export const WS_NEW_MESSAGE = 'NEW_MESSAGE';
export const WS_USER_STATUS = 'USER_STATUS';
export const WS_OFFER_THUMBNAIL = 'OFFER_THUMBNAIL';
export const WS_SHOP_AVATAR = 'SHOP_AVATAR';
export const WS_USER_AVATAR = 'USER_AVATAR';
export const WS_MAINTENANCE = 'MAINTENANCE';
