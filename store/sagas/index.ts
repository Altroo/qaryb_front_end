import { all, spawn, call, fork } from 'redux-saga/effects';
import { watchInit } from './_init/_initSaga';
import { watchShop } from './shop/shopSaga';
import { watchOffer } from './offer/offerSaga';
import { watchPlaces } from './places/placesSaga';
import { watchVersion } from './version/versionSaga';
import { watchAccount } from './account/accountSaga';
import { watchWS } from './ws/wsSaga';
import { watchSubscription } from './subscription/subscriptionSaga';
import { watchNotifications } from './notification/notificationSaga';
import { watchSeoPages } from './seo_pages/seoPagesSaga';
import {watchCart} from './cart/cartSaga';
import {watchOrder} from './order/orderSaga';
import {watchMessages} from './messages/messagesSaga';

// spawn : whenever a watcher get's crashed somehow,
// we use spawn to respawn it back. (except it's unblocking)
// fork : for blocking calls.
// export function* rootSaga() {
// 	yield all([
// 		// watchAccount(),
// 		spawn(watchInit),
// 		spawn(watchShop),
// 		spawn(watchOffer),
// 		spawn(watchPlaces),
// 		spawn(watchVersion),
// 		spawn(watchAccount),
// 		spawn(watchSubscription),
// 		spawn(watchNotifications),
// 		// spawn(watchOrder),
// 		// spawn(watchRating),
// 		fork(watchWS),
// 	]);
// }

// export function* rootSaga() {
// 	yield all([
// 		// watchAccount(),
// 		fork(watchInit),
// 		fork(watchShop),
// 		fork(watchOffer),
// 		fork(watchPlaces),
// 		fork(watchVersion),
// 		fork(watchAccount),
// 		fork(watchSubscription),
// 		// yield spawn(watchOrder),
// 		// yield spawn(watchRating),
// 		fork(watchWS),
// 	]);
// }

// export function* rootSaga() {
// 	const sagas = [
// 		watchInit,
// 		watchShop,
// 		watchOffer,
// 		watchPlaces,
// 		watchVersion,
// 		watchAccount,
// 		watchSubscription,
// 		watchNotifications,
// 		watchWS,
// 	];
// 	// yield sagas.map(
// 	// 	(saga) =>
// 	// 		function* () {
// 	// 			while (true) {
// 	// 				try {
// 	// 					yield spawn(saga);
// 	// 				} catch (e) {
// 	// 					console.log(e);
// 	// 				}
// 	// 			}
// 	// 		},
// 	// );
// 	yield sagas.map(
// 		(saga) =>
// 			spawn(function* () {
// 				let isSyncError = false;
// 				while (!isSyncError) {
// 					isSyncError = true;
// 					try {
// 						setTimeout(() => (isSyncError = false));
// 						yield call(saga);
// 						break;
// 					} catch (e) {
// 						if (isSyncError) {
// 							throw new Error(saga.name + ' was terminated because it threw an exception on startup.' + e);
// 						}
// 					}
// 				}
// 			}),
// 	);
// }

const sagas = [
	watchInit,
	watchShop,
	watchOffer,
	watchPlaces,
	watchVersion,
	watchAccount,
	watchSubscription,
	watchNotifications,
	watchSeoPages,
	watchCart,
	watchOrder,
	watchMessages,
];
export function* rootSaga() {
	yield all([...sagas.map(saga =>
      spawn(function*() {
        while (true) {
          try {
            yield call(saga);
          } catch (e) {
						throw new Error('Saga error : ' + e);
          }
        }
      })
    ),
		fork(watchWS),
		]
  );
}