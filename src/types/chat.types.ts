import { Prisma } from "../generated/prisma"
import { Result } from "./result"
import { Request, Response } from "express"
import { UserToChat } from "./userToChat.types"

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

type ChatWithUsersAndAvatarAndAdmin = Prisma.ChatGetPayload<{
	include: {
		users: true
		avatar: true,
		admin: true
	}
}>

type CreateGroupCredentials = {
	name: string
	avatar?: string
	users: UserToChat[]
	adminId: number
}

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
	// chat
	getChat: (
		req: Request<{}, {}, { userId: number; anotherUserId: number }>,
		res: Response,
	) => void
	getIndividualChats: (
		req: Request<{ id: string }, {}, {}>,
		res: Response,
	) => void

	// group
	createGroup: (
		req: Request<{}, {}, CreateGroupCredentials>,
		res: Response,
	) => void
	getGroup: (req: Request, res: Response) => void
	getAllGroups: (
		req: Request,
		res: Response,
	) => void
}

export interface ChatService {
	// chat
	getChat: (
		userId: number,
		anotherUserId: number,
	) => Promise<Result<ChatWithAllIncludes>>
	getIndividualChats: (
		userId: number,
	) => Promise<Result<ChatWithUsersAndMessages[]>>

	//group
	createGroup: (
		data: CreateGroupCredentials,
	) => Promise<Result<ChatWithUsersAndAvatarAndAdmin>>
	getGroup: (groupId: number) => Promise<Result<ChatWithAllIncludes>>
	getAllGroups: (userId: number) => Promise<Result<ChatWithUsersAndMessages[]>>
}

export interface ChatRepository {
	//
	createIndividualChat: (
		adminId: number,
		userId: number,
	) => Promise<Result<ChatWithAllIncludes>>
	getChat: (
		userId: number,
		anotherUserId: number,
	) => Promise<Result<ChatWithAllIncludes>>

	getIndividualChats: (
		userId: number,
	) => Promise<Result<ChatWithUsersAndMessages[]>>

	// message
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

	//group
	createGroup: (
		data: CreateGroupCredentials,
	) => Promise<Result<ChatWithUsersAndAvatarAndAdmin>>
	getGroup: (groupId: number) => Promise<Result<ChatWithAllIncludes>>
	getAllGroups: (userId: number) => Promise<Result<ChatWithUsersAndMessages[]>>
}
