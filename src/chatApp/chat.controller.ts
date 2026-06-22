import { ChatController } from "../types/chat.types"
import { chatService } from "./chat.service"

export const chatController: ChatController = {
	getChat: async (req, res) => {
		const { userId, anotherUserId } = req.body

		const result = await chatService.getChat(userId, anotherUserId)

		res.json(result)
	},
	getIndividualChats: async (req, res) => {
		const { id } = req.params

		const result = await chatService.getIndividualChats(+id)

		res.json(result)
	},
	createGroup: async (req, res) => {
		const data = req.body
		console.log(data)
		const result = await chatService.createGroup(data)
		res.json(result)
	},
	getGroup: async (req, res) => {
		const { id } = req.params
		const result = await chatService.getGroup(+id)
		res.json(result)
	},
	getAllGroups: async (req, res) => {
		const { id } = req.params
		const result = await chatService.getAllGroups(+id)
		res.json(result)
	},
}
