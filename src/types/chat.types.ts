import { Prisma } from "../generated/prisma"
import { Result } from "./result"
import { Request, Response } from "express"

export type ChatIncludes = Prisma.ChatInclude

export type ChatWithAllIncludes = Prisma.ChatGetPayload<{
	include: ChatIncludes
}>

type ChatWithUsersAndMessages = Prisma.ChatGetPayload<{
	include: {
		users: true
		messages: {
			include: {
				readers: true
			}
		}
	}
}>

export type Chat = Prisma.ChatGetPayload<{
	include: {
		admin: true
		users: true
	}
}>

type MessageIncludes = Prisma.MessageInclude

export type MessageWithAllIncludes = Prisma.MessageGetPayload<{
	include: MessageIncludes
}>

export type MessageWithoutIncludes = Prisma.MessageGetPayload<{}>

export type MessageWithSender = Prisma.MessageGetPayload<{
	include: {
		sender: true
	}
}>

export type MessageWithReaders = Prisma.MessageGetPayload<{
	include: {
		readers: true
	}
}>

export type MessageWithImage = Prisma.MessageGetPayload<{
	include: {
		images: true
	}
}>

export interface ChatController {
	getChat: (
		req: Request<{}, {}, { userId: number; anotherUserId: number }>,
		res: Response,
	) => void
	// getMessagesFromChat: (
	// 	req: Request<{ id: string }, {}, {}>,
	// 	res: Response,
	// ) => void
	getIndividualChats: (
		req: Request<{ id: string }, {}, {}>,
		res: Response,
	) => void
}

export interface ChatService {
	getChat: (
		userId: number,
		anotherUserId: number,
	) => Promise<Result<ChatWithAllIncludes>>
	// getMessagesFromChat: (
	// 	chatId: number,
	// ) => Promise<Result<MessageWithAllIncludes[]>>
	getIndividualChats: (
		userId: number,
	) => Promise<Result<ChatWithUsersAndMessages[]>>
}

export interface ChatRepository {
	createIndividualChat: (
		adminId: number,
		userId: number,
	) => Promise<Result<ChatWithAllIncludes>>
	getChat: (
		userId: number,
		anotherUserId: number,
	) => Promise<Result<ChatWithAllIncludes>>
	createMessage: (
		data: Pick<
			MessageWithImage,
			"text" | "senderId" | "chatId"
			// | "images"
		>,
	) => Promise<Result<MessageWithSender>>
	seeMessage: (data: {
		messageId: number
		readerId: number
	}) => Promise<Result<MessageWithReaders>>
	// getMessagesFromChat: (
	// 	chatId: number,
	// ) => Promise<Result<MessageWithAllIncludes[]>>
	getIndividualChats: (
		userId: number,
	) => Promise<Result<ChatWithUsersAndMessages[]>>
}
