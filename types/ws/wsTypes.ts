import { NotificationsType } from "../notification/notificationTypes";

export type WSEventType =
	| 'NEW_MESSAGE'
	| 'MSG_SEEN'
	| 'USER_STATUS'
	| 'SHOP_AVATAR'
	| 'USER_AVATAR'
	| 'MAINTENANCE'
	| 'OFFER_PICTURE_1'
	| 'OFFER_PICTURE_1_THUMB'
	| 'OFFER_PICTURE_2'
	| 'OFFER_PICTURE_2_THUMB'
	| 'OFFER_PICTURE_3'
	| 'OFFER_PICTURE_3_THUMB'
	| 'OFFER_PICTURE_4'
	| 'OFFER_PICTURE_4_THUMB'
	| 'NOTIFICATION'
	| 'FACTURE_PDF';


export type WSEvent<T> = {
	message: T;
};
/*
"message": {
	"pk": offer.pk,
	"offer_picture": offer.get_absolute_picture_1 [..._thumbnail, ...],
}
 */
/* OFFER_PICTURE_1 'OFFER_PICTURE_1' | 'OFFER_PICTURE_1_THUMB' | 'OFFER_PICTURE_2' | 'OFFER_PICTURE_2_THUMB' |
'OFFER_PICTURE_3' | 'OFFER_PICTURE_3_THUMB' |
'OFFER_PICTURE_4' | 'OFFER_PICTURE_4_THUMB' */
interface WSRootType {
	type: WSEventType;
}

export interface WSOfferPictureType extends WSRootType {
	pk: number;
	offer_picture: string;
}

/*
"message": {
	"pk": object_.user.pk,
	"avatar": object_.get_absolute_avatar_thumbnail,
}
 */
// SHOP_AVATAR
export interface WSShopAvatar extends WSRootType {
	pk: number;
	avatar: string;
}
/*
"message": {
	"pk": object_.pk,
	"avatar": object_.get_absolute_avatar_thumbnail,
}
 */
// USER_AVATAR
export interface WSUserAvatar extends WSRootType {
	pk: number;
	avatar: string;
}
/*
"message": {
	"recipient": user.user.pk,
	"maintenance": True / False
}
 */
// MAINTENANCE
export interface WSMaintenance extends WSRootType {
	recipient: number;
	maintenance: boolean;
}

/*

 */
export interface WSNotification extends WSRootType {
	pk: number,
	body: string | null,
	type_: NotificationsType,
	viewed: boolean,
	created_date: string,
}

export interface WSFacture extends WSRootType {
	path: string,
}

export interface WSChatNewMessage extends WSRootType {
	pk: number,
	initiator: number,
	recipient: number,
	body: string
}
/*
"message": {
	"pk": self.id,
	"initiator": self.user.id,
	"recipient": self.recipient.id,
}
 */
export interface WSChatMessageSeen extends WSRootType {
	pk: number,
	initiator: number,
	recipient: number,
}
/*
"message": {
	"user_pk": self.user.pk,
	"online": True,
	"recipient_pk": user_pk,
}
 */
export interface WSChatUserStatus extends WSRootType {
	user: number,
	online: boolean,
	recipient: number,
}