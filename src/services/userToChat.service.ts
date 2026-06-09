import { userToChatRepository } from "../repositories/userToChat.repository"
import { UserToChatService } from "../types/services"

export const userToChatService: UserToChatService = {
	create: async (credentials) => {
		await userToChatRepository.create(credentials)
	},
	change: async (credentials) => {
		console.log("idi nahuy")
		await userToChatRepository.change(credentials)
	},
	delete: async (credentials) => {
		await userToChatRepository.delete(credentials.id)
	},
}
