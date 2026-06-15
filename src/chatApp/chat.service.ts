import { error } from "../tools/result"
import { ChatService } from "../types/chat.types"
import { chatRepository } from "./chat.repository"

export const chatService: ChatService = {
	getChat: async (userId, anotherUserId) => {
		try {
			const findChat = await chatRepository.getChat(userId, anotherUserId)
			if (findChat.status === "success") {
				return findChat
			}
			const createChat = await chatRepository.createIndividualChat(
				userId,
				anotherUserId,
			)
			return createChat
		} catch (err) {
			return error(`${err}`)
		}
	},
	getIndividualChats: async (userId) => {
		try {
			const allChats = await chatRepository.getIndividualChats(userId)
			return allChats
		} catch (err) {
			return error(`${err}`)
		}
	} 
}
