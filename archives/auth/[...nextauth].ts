// import NextAuth, { NextAuthOptions } from 'next-auth';
// import FacebookProvider from 'next-auth/providers/facebook';
// import GoogleProvider from 'next-auth/providers/google';
// import { allowAnyInstance, setRemoteCookiesAppToken } from "../../../utils/helpers";
// import { AccountPostFacebookResponseType, AccountPostGoogleResponseType } from '../../../types/account/accountTypes';
// import { postApi } from '../../../store/services/_init/_initAPI';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { InitStateInterface, InitStateToken, InitStateUniqueID, tokenUser } from "../../../types/_init/_initTypes";
// import { emptyInitStateUniqueID } from "../../../store/slices/_init/_initSlice";
// import { setAuthTokenCookie, setCookie } from "../../../utils/cookies";
//
// // For more information on each option (and a full list of options) go to
// // https://next-auth.js.org/configuration/options
// // export default NextAuth();
//
// const getOptions = (req: NextApiRequest, res: NextApiResponse) => {
// 	return {
// 		// https://next-auth.js.org/configuration/providers
// 		providers: [
// 			FacebookProvider({
// 				clientId: `${process.env.FACEBOOK_ID}`,
// 				clientSecret: `${process.env.FACEBOOK_SECRET}`,
// 			}),
// 			GoogleProvider({
// 				clientId: `${process.env.GOOGLE_ID}`,
// 				clientSecret: `${process.env.GOOGLE_SECRET}`,
// 				authorization: {
// 					params: {
// 						prompt: 'consent',
// 						access_type: 'offline',
// 						response_type: 'code',
// 					},
// 				},
// 			}),
// 		],
// 		// The secret should be set to a reasonably long random string.
// 		// It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
// 		// a separate secret is defined explicitly for encrypting the JWT.
// 		secret: process.env.SECRET,
//
// 		session: {
// 			// Use JSON Web Tokens for session instead of database sessions.
// 			// This option can be used with or without a database for users/accounts.
// 			// Note: `strategy` should be set to 'jwt' if no database is used.
// 			strategy: 'jwt',
//
// 			// Seconds - How long until an idle session expires and is no longer valid.
// 			maxAge: 30 * 24 * 60 * 60, // 30 days
//
// 			// Seconds - Throttle how frequently to write to database to extend a session.
// 			// Use it to limit write operations. Set to 0 to always update the database.
// 			// Note: This option is ignored if using JSON Web Tokens
// 			// updateAge: 24 * 60 * 60, // 24 hours
// 		},
//
// 		// JSON Web tokens are only used for sessions if the `strategy: 'jwt'` session
// 		// option is set - or by default if no database is specified.
// 		// https://next-auth.js.org/configuration/options#jwt
// 		jwt: {
// 			// A secret to use for key generation (you should set this explicitly)
// 			secret: process.env.SECRET,
// 			// Set to true to use encryption (default: false)
// 			// encryption: true,
// 			// You can define your own encode/decode functions for signing and encryption
// 			// if you want to override the default behaviour.
// 			// encode: async ({ secret, token, maxAge }) => {},
// 			// decode: async ({ secret, token, maxAge }) => {},
// 		},
//
// 		// You can define custom pages to override the built-in ones. These will be regular Next.js pages
// 		// so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
// 		// The routes shown here are the default URLs that will be used when a custom
// 		// pages is not specified for that route.
// 		// https://next-auth.js.org/configuration/pages
// 		pages: {
// 			signIn: '/login/index', // Displays signin buttons
// 			// signOut: '/auth/signout', // Displays form with sign out button
// 			// error: '/auth/error', // Error code passed in query string as ?error=
// 			// verifyRequest: '/auth/verify-request', // Used for check email page
// 			// newUser: null // If set, new users will be directed here on first sign in
// 		},
//
// 		// Callbacks are asynchronous functions you can use to control what happens
// 		// when an action is performed.
// 		// https://next-auth.js.org/configuration/callbacks
// 		callbacks: {
// 			/*
// 			{
// 		    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjY4MzU1NjE5LCJpYXQiOjE2NjMxNzE2MTksImp0aSI6ImZlNjcxYWI3ZjRlNzRhODFhYmViYjg1YTk4N2VhZjVlIiwidXNlcl9pZCI6MTV9.YE8Xl2DGFISWik1Tb7TBLM3DA0XF_6YfKHHAQ4dR3Bk",
// 		    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY5NDcwNzYxOSwiaWF0IjoxNjYzMTcxNjE5LCJqdGkiOiJlYjcwZGU1ZDRlNjE0MjQ0OTM2ZWE0MmNjNjllM2Y0YiIsInVzZXJfaWQiOjE1fQ.9S16z1pxCUKP24TzFUrhbKCrrNxciCslqaENaDCPP_M",
// 		    "user": {
// 		        "pk": 15,
// 		        "email": "youness.elalami02@gmail.com",
// 		        "first_name": "Youness",
// 		        "last_name": "El Alami"
// 		    },
// 		    "access_token_expiration": "2022-11-13T16:06:59.698694Z",
// 		    "refresh_token_expiration": "2023-09-14T16:06:59.698700Z"
// 				}
// 			 */
// 			async signIn({ user, account, profile, email, credentials }) {
// 				if (account.provider === 'google') {
// 					// extract needed tokens
// 					const { access_token, id_token } = account;
// 					// send a POST request
// 					const url = `${process.env.NEXT_PUBLIC_ACCOUNT_GOOGLE}`;
// 					try {
// 						const instance = allowAnyInstance();
// 						const response: AccountPostGoogleResponseType = await postApi(url, instance, {
// 							access_token: access_token,
// 							id_token: id_token,
// 						});
// 						account.user = response.data.user;
// 						account.access_token = response.data.access_token as string;
// 						account.refresh_token = response.data.refresh_token as string;
// 						account.access_token_expiration = response.data.access_token_expiration as string;
// 						account.refresh_token_expiration = response.data.refresh_token_expiration as string;
// 						return true;
// 					} catch (e) {
// 						return false;
// 					}
// 				} else if (account.provider === 'facebook') {
// 					// extract needed tokens
// 					const { access_token, id_token } = account;
// 					// send a POST request
// 					const url = `${process.env.NEXT_PUBLIC_ACCOUNT_FACEBOOK}`;
// 					try {
// 						const instance = allowAnyInstance();
// 						const response: AccountPostFacebookResponseType = await postApi(url, instance, {
// 							access_token: access_token,
// 							id_token: id_token,
// 						});
// 						account.user = response.data.user;
// 						account.access_token = response.data.access_token as string;
// 						account.refresh_token = response.data.refresh_token as string;
// 						account.access_token_expiration = response.data.access_token_expiration as string;
// 						account.refresh_token_expiration = response.data.refresh_token_expiration as string;
// 						return true;
// 					} catch (e) {
// 						return false;
// 					}
// 				}
// 				return false;
// 			},
// 			// async redirect({ url, baseUrl }) { return baseUrl },
// 			async jwt({ token, user, account, profile, isNewUser }) {
// 				const options = {
// 					httpOnly: true,
// 					secure: true,
// 					path: '/',
// 					domain: `${process.env.NEXT_BACKEND_DOMAIN}`,
// 				};
// 				if (account) {
// 					token.accessToken = account.access_token;
// 					token.accessTokenExpiration = account.access_token_expiration;
// 					token.refreshTokenExpiration = account.refresh_token_expiration;
// 					token.refreshToken = account.refresh_token;
// 					token.user = account.user as tokenUser;
// 					const newInitStateToken: InitStateInterface<InitStateToken, InitStateUniqueID> = {
// 							tokenType: 'TOKEN',
// 							initStateToken: {
// 								user: account.user as tokenUser,
// 								access_token: account.access_token as string,
// 								refresh_token: account.refresh_token as string,
// 								access_token_expiration: account.access_token_expiration as string,
// 								refresh_token_expiration: account.refresh_token_expiration as string,
// 							},
// 							initStateUniqueID: emptyInitStateUniqueID,
// 						};
// 						// await setRemoteCookiesAppToken(newInitStateToken);
// 						// setCookie(res, '@tokenType', newInitStateToken.tokenType, {
// 						// 	maxAge: 86400,
// 						// 	sameSite: 'none',
// 						// 	...options,
// 						// });
// 						setAuthTokenCookie(res, newInitStateToken, {
// 							maxAge: 86400,
// 							sameSite: 'none',
// 							...options,
// 						});
// 						// setCookie(res, '@initStateToken', newInitStateToken.initStateToken, {
// 						// 	maxAge: 86400,
// 						// 	sameSite: 'none',
// 						// 	...options,
// 						// });
// 						// setCookie(res, '@initStateUniqueID', newInitStateToken.initStateUniqueID, {
// 						// 	maxAge: 86400,
// 						// 	sameSite: 'none',
// 						// 	...options,
// 						// });
// 				}
// 				return token;
// 			},
// 			async session({ session, token, user }) {
// 				session.accessToken = token.accessToken;
// 				session.refreshToken = token.refreshToken;
// 				session.accessTokenExpiration = token.accessTokenExpiration;
// 				session.refreshTokenExpiration = token.refreshTokenExpiration;
// 				session.user = token.user as tokenUser;
// 				return session;
// 			},
// 		},
//
// 		// Events are useful for logging
// 		// https://next-auth.js.org/configuration/events
// 		events: {},
//
// 		// Enable debug messages in the console if you are having problems
// 		debug: true,
// 	} as NextAuthOptions;
// };
//
// const handler = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, getOptions(req, res));
//
// export default handler;
// @ts-ignore
{}
