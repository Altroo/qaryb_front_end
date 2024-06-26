// Site root
export const SITE_ROOT = `${process.env.NEXT_PUBLIC_DOMAIN_URL_PREFIX}/`;
// 404 page
export const NOT_FOUND_404 = `${SITE_ROOT}404`;
// CGU page
export const CGU_PAGE = `${SITE_ROOT}cgu`;

// Footer pages
export const NOTRE_MISSION_FOOTER_PAGE = `${SITE_ROOT}notre-mission`;
export const PARTENARIAT_FOOTER_PAGE = `${SITE_ROOT}partenariat`;
export const CARRIERE_FOOTER_PAGE = `${SITE_ROOT}carriere`;
export const CREER_VOTRE_BOUTIQUE_FOOTER_PAGE = `${SITE_ROOT}creez-votre-boutique`;
export const LES_VENDEURS_INSTAGRAM_FOOTER_PAGE = `${SITE_ROOT}boutique-en-ligne-maroc`;
export const REFERENCER_VOS_ARTICLES_FOOTER_PAGE = `${SITE_ROOT}referencer-vos-articles`;
export const DES_QUESTION_FOOTER_PAGE = `${SITE_ROOT}des-question`;



// Auth Shop Routes
const REAL_SHOP_ROOT = 'shop';
const SHOP_OFFER_ROOT = 'article';
const SHOP_OFFER_PRODUCT = 'produit';
export const REAL_SHOP_ADD_SHOP_NAME = `${SITE_ROOT}${REAL_SHOP_ROOT}/create`;
export const REAL_SHOP_ADD_AVATAR = `${SITE_ROOT}${REAL_SHOP_ROOT}/create/avatar`;
export const REAL_SHOP_ADD_COLOR = `${SITE_ROOT}${REAL_SHOP_ROOT}/create/color`;
export const REAL_SHOP_ADD_FONT = `${SITE_ROOT}${REAL_SHOP_ROOT}/create/font`;

// Auth Shop Routes
export const REAL_SHOP_BY_SHOP_LINK_ROUTE = (shop_link: string) => `${SITE_ROOT}${REAL_SHOP_ROOT}/${shop_link}`;
// Real Offers Routes
// offer details by offer_pk
export const REAL_OFFER_ROUTE = (shop_link: string, offer_pk: string) => `${SITE_ROOT}${REAL_SHOP_ROOT}/${shop_link}/${SHOP_OFFER_ROOT}/${offer_pk}`;
// add offer (product, service, location) page.
export const REAL_OFFER_ADD_INDEX = (shop_link: string) => `${SITE_ROOT}${REAL_SHOP_ROOT}/${shop_link}/${SHOP_OFFER_ROOT}`;
export const REAL_OFFER_ADD_SERVICE_CATEGORIES = (shop_link: string) => `${SITE_ROOT}${REAL_SHOP_ROOT}/${shop_link}/${SHOP_OFFER_ROOT}/service`;
export const REAL_OFFER_ADD_SERVICE_DESCRIPTION = (shop_link: string) => `${SITE_ROOT}${REAL_SHOP_ROOT}/${shop_link}/${SHOP_OFFER_ROOT}/service/description`;
export const REAL_OFFER_ADD_SERVICE_PRICE = (shop_link: string) => `${SITE_ROOT}${REAL_SHOP_ROOT}/${shop_link}/${SHOP_OFFER_ROOT}/service/prix`;

// add offer (product) first page (categories).
export const REAL_OFFER_ADD_PRODUCT_CATEGORIES = (shop_link: string) => `${SITE_ROOT}${REAL_SHOP_ROOT}/${shop_link}/${SHOP_OFFER_ROOT}/${SHOP_OFFER_PRODUCT}`;
export const REAL_OFFER_ADD_PRODUCT_DESCRIPTION = (shop_link: string) => `${SITE_ROOT}${REAL_SHOP_ROOT}/${shop_link}/${SHOP_OFFER_ROOT}/${SHOP_OFFER_PRODUCT}/description`;
export const REAL_OFFER_ADD_PRODUCT_PRICE = (shop_link: string) => `${SITE_ROOT}${REAL_SHOP_ROOT}/${shop_link}/${SHOP_OFFER_ROOT}/${SHOP_OFFER_PRODUCT}/prix`;
export const REAL_OFFER_ADD_PRODUCT_DELIVERIES = (shop_link: string) => `${SITE_ROOT}${REAL_SHOP_ROOT}/${shop_link}/${SHOP_OFFER_ROOT}/${SHOP_OFFER_PRODUCT}/livraison`;

// export const REAL_SHOP_EDIT_ROUTE = '/shop/edit'; //replaced by shop url page itself

// Auth Routes
export const AUTH_REGISTER = `${SITE_ROOT}auth/register`;
// Register second page (details page)
export const AUTH_REGISTER_ABOUT_PAGE = `${SITE_ROOT}auth/register/about`;
export const AUTH_FB_EMAIL_MISSING = `${SITE_ROOT}auth/register/missing-email`;
export const AUTH_WELCOME = `${SITE_ROOT}auth/register/welcome`;

// Auth Login
export const AUTH_LOGIN = `${SITE_ROOT}auth/login`;
// Auth forgot password
export const AUTH_RESET_PASSWORD = `${SITE_ROOT}auth/reset-password`;
export const AUTH_RESET_PASSWORD_ENTER_CODE = `${SITE_ROOT}auth/reset-password/enter-code`;
export const AUTH_RESET_PASSWORD_SET_PASSWORD = `${SITE_ROOT}auth/reset-password/set-password`;
export const AUTH_RESET_PASSWORD_COMPLETE = `${SITE_ROOT}auth/reset-password/set-password-complete`;

// dashboard index
export const DASHBOARD = `${SITE_ROOT}dashboard`;
// Mon profil
export const DASHBOARD_ACCOUNT = `${SITE_ROOT}dashboard/compte`; // placeholder with redirect
export const DASHBOARD_EDIT_PROFILE = `${SITE_ROOT}dashboard/compte/edit-profil`;
export const DASHBOARD_ADRESSE_EMAIL = `${SITE_ROOT}dashboard/compte/adresse-email`;
export const DASHBOARD_PASSWORD = `${SITE_ROOT}dashboard/compte/mot-de-passe`;
export const DASHBOARD_COMPTE_BLOQUES = `${SITE_ROOT}dashboard/compte/comptes-bloques`;
// my business
export const DASHBOARD_SUBSCRIPTION = `${SITE_ROOT}dashboard/my-business/abonnement`;
export const DASHBOARD_NEW_SUBSCRIPTION = `${SITE_ROOT}dashboard/my-business/abonnement/checkout`;
export const DASHBOARD_UPGRADE_SUBSCRIPTION = `${SITE_ROOT}dashboard/my-business/abonnement/update-checkout`;
export const DASHBOARD_SUBSCRIPTION_PAY_VIA_VIREMENT = `${SITE_ROOT}dashboard/my-business/abonnement/par-virement`;
export const DASHBOARD_INDEXED_OFFERS = `${SITE_ROOT}dashboard/my-business/articles-references`;
export const DASHBOARD_ADD_INDEX_OFFERS = `${SITE_ROOT}dashboard/my-business/articles-references/add-offers`;
export const DASHBOARD_AUDIENCES = `${SITE_ROOT}dashboard/my-business/audience`;
export const DASHBOARD_CHIFFRE_DAFFAIRE = `${SITE_ROOT}dashboard/my-business/chiffre-d-affaire`;
export const DASHBOARD_ORDERS = `${SITE_ROOT}dashboard/my-business/orders`;
export const DASHBOARD_ORDER_DETAIL = (order_pk: number) => `${SITE_ROOT}dashboard/my-business/orders/${order_pk}`;
// Panier
export const PANIER = `${SITE_ROOT}panier`;
export const PANIER_DETAILS_BY_SHOP_PK = (shop_pk: number) => `${PANIER}/${shop_pk}`;
export const PANIER_ORDER_BY_SHOP_PK = (shop_pk: number) => `${PANIER}/${shop_pk}/order`;
export const PANIER_ORDER_COMPLETE = (shop_pk: number) => `${PANIER}/${shop_pk}/order-complete`;

// user index - (view profil - has shop data - user data or both)
export const USER_VIEW_PROFILE_BY_ID = (user_id: number) => `/user/${user_id}/`;

// Blog test
export const BLOG = `${SITE_ROOT}blog`;

// Chat
export const CHAT_INDEX = `${SITE_ROOT}messages`;
export const CHAT_BY_RECEIVER_PK = (receiver_pk: number) => `${CHAT_INDEX}/${receiver_pk}`;