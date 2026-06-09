import { prismaClient } from "../prisma/clients"
import { UserToChatRepository } from "../types/repositories"

export const userToChatRepository: UserToChatRepository = {
	create: async (credentials) => {
		try {
			const user = await prismaClient.userToChat.create({
				data: credentials,
			})

			console.log("userToPost created")
		} catch (err) {
			console.log(`${err}`)
		}
	},
	change: async (credentials) => {
		try {
			const updatedUser = await prismaClient.userToChat.update({
				where: {
					id: credentials.id,
				},
				data: { ...credentials, id: undefined },
			})

			console.log("userToPost updated")
		} catch (err) {
			console.log(`${err}`)
		}
	},
	delete: async (id) => {
		try {
			const deletedUser = await prismaClient.userToChat.delete({
				where: { id },
			})

			console.log("userToPost deleted")
		} catch (err) {
			console.log(`${err}`)
		}
	},
}
