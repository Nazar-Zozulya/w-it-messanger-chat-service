import { text } from "express"
import { prismaClient } from "../prisma/clients"
import { error, success } from "../tools/result"
import { ChatRepository } from "../types/chat.types"

export const chatRepository: ChatRepository = {
	getChat: async (userId, anotherUserId) => {
		try {
			const chat = await prismaClient.chat.findFirst({
				where: {
					OR: [
						{
							adminId: anotherUserId,
							users: {
								some: {
									id: userId,
								},
							},
						},
						{
							adminId: userId,
							users: {
								some: {
									id: anotherUserId,
								},
							},
						},
					],
					isGroup: false,
				},
				include: {
					admin: true,
					users: true,
					messages: {
						include: {
							sender: true,
							readers: true,
						},
					},
					avatar: true,
					_count: true,
				},
			})

			if (!chat) {
				return error("chat not found")
			}
			return success(chat)
		} catch (err) {
			return error(`${err}`)
		}
	},

	createIndividualChat: async (adminId, userId) => {
		try {
			const newChat = await prismaClient.chat.create({
				data: {
					adminId,
					isGroup: false,
					users: {
						connect: [{ id: userId }, { id: adminId }],
					},
				},
				include: {
					admin: true,
					users: true,
					messages: {
						include: {
							sender: true,
							readers: true,
						},
					},
					avatar: true,
					_count: true,
				},
			})
			return success(newChat)
		} catch (err) {
			return error(`${err}`)
		}
	},
	createMessage: async (data) => {
		try {
			const newMessage = await prismaClient.message.create({
				data: {
					text: data.text,
					senderId: data.senderId,
					chatId: data.chatId,
					// images:
					// 	data.images.length > 0
					// 		? {
					// 				createMany: {
					// 					data: data.images.map((image) => ({
					// 						base64: image.base64,
					// 					})),
					// 				},
					// 			}
					// 		: {},
				},
				include: {
					images: true,
					sender: true,
				},
			})

			if (!newMessage) return error("Проблеми зі створенням повідомлення")

			return success(newMessage)
		} catch (err) {
			return error(`${err}`)
		}
	},

	seeMessage: async (data) => {
		try {
			const viewedMessage = await prismaClient.message.update({
				where: {
					id: data.messageId,
				},
				data: {
					readers: {
						connect: {
							id: data.readerId,
						},
					},
				},
				include: {
					readers: true,
				},
			})

			if (!viewedMessage)
				return error("Проблеми зі обновленням повідомлення")

			return success(viewedMessage)
		} catch (err) {
			return error(`${err}`)
		}
	},
	getIndividualChats: async (userId) => {
		try {
			const allChats = await prismaClient.chat.findMany({
				where: {
					AND: {
						users: {
							some: {
								id: userId,
							},
						},
						isGroup: false,
					},
				},
				include: {
					users: true,
					messages: {
						orderBy: {
							createdAt: "desc",
						},
						take: 1,
						include: {
							readers: true,
						},
					},
				},
			})

			return success(allChats)
		} catch (err) {
			return error(`${err}`)
		}
	},
	createGroup: async (data) => {
		try {
			const newGroup = await prismaClient.chat.create({
				data: {
					name: data.name,
					isGroup: true,
					admin: {
						connect: {
							id: data.adminId,
						},
					},
					users: {
						connect: [
							...data.users.map((user) => ({
								id: user.id,
							})),
							{ id: data.adminId },
						],
					},
					avatar: data.avatar
						? {
								create: {
									base64: data.avatar,
								},
							}
						: undefined,
				},
				include: {
					users: true,
					admin: true,
					avatar: true,
					// messages: true
				},
			})

			return success(newGroup)
		} catch (err) {
			return error(`${err}`)
		}
	},

	getGroup: async (groupId) => {
		try {
			const group = await prismaClient.chat.findFirstOrThrow({
				where: {
					id: groupId,
				},
				include: {
					admin: true,
					users: true,
					messages: {
						include: {
							sender: true,
							readers: true,
						},
					},
					avatar: true,
					_count: true,
				},
			})

			if (!group) return error("Группи не знайденно!")

			return success(group)
		} catch (err) {
			return error(`${err}`)
		}
	},
	getAllGroups: async (userId) => {
		try {
			const groups = await prismaClient.chat.findMany({
				where: {
					AND: {
						users: {
							some: {
								id: userId,
							},
						},
						isGroup: true,
					},
				},
				include: {
					users: true,
					messages: {
						orderBy: {
							createdAt: "desc",
						},
						take: 1,
						include: {
							readers: true,
						},
					},
				},
			})

			return success(groups)
		} catch (err) {
			return error(`${err}`)
		}
	},
}
