import { PaginationResponseType, ResponseDataInterface } from '../_init/_initTypes';

type PayloadType = {
	type: string;
};

//!- Chat State
export interface ChatStateInterface {
	conversationsList: PaginationResponseType<ChatGetConversationsType>;
	selectedConversation: ChatGetMessagesOfTargetInterface;
}

export interface ChatPostMessageType extends PayloadType{
	recipient_pk: number,
	body: string | null,
	attachment: File | string | null,
}

export type ChatPostMessageOutput = {
	pk: number,
	user: number,
	initiator: string,
	recipient: number,
	created: string,
	body: string | null,
	attachment_link: string | null,
	attachment_thumbnail_link: string | null,
	viewed: boolean,
}
export type ChatPostMessageResponseType = ResponseDataInterface<ChatPostMessageOutput>;
export type ChatGetMessageOutput = ChatPostMessageOutput;
export type ChatGetMessageResponseType = ResponseDataInterface<ChatGetMessageOutput>;
export type ChatPatchMessageSeenResponseType = ChatPostMessageResponseType;

export type ChatGetMessagesOfTargetReceiverShopPart = {
	shop_pk: number,
	shop_name: string,
	shop_avatar: string,
	// mode_vacance: boolean // disabled
}

export type ChatGetMessagesOfTargetReceiverPart = {
	pk: number,
	first_name: string,
	last_name: string,
	picture: string,
	online: boolean,
	online_timestamp: string,
	shop: ChatGetMessagesOfTargetReceiverShopPart
}

export interface ChatGetMessagesOfTargetInterface {
	receiver: ChatGetMessagesOfTargetReceiverPart | null,
	chat_messages: PaginationResponseType<ChatPostMessageOutput>
}

export type ChatGetMessagesOfTargetResponseType = ResponseDataInterface<ChatGetMessagesOfTargetInterface>;

export type ChatGetConversationsType = {
	pk: number,
	user_pk: number,
	user_avatar: string,
	user_first_name: string,
	user_last_name: string,
	body: string,
	viewed: boolean,
	created: string,
	online: boolean,
	shop_pk: number,
	shop_name: string,
	shop_avatar_thumbnail: string,
}

export type ChatGetConversationsPaginatedType = PaginationResponseType<ChatGetConversationsType>;

export type ChatGetConversationsResponseType = ResponseDataInterface<ChatGetConversationsPaginatedType>;