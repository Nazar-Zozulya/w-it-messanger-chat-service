import { Namespace, Server, Socket } from "socket.io"
import { chatService } from "../../../chatApp/chat.service"

export function registerGlobalChatMessageHandler(
	io: Namespace,
	socket: Socket,
) {
	socket.on("user:get-statuses", async (userId: number) => {
		const allChats = await chatService.getIndividualChats(userId)

		if (allChats.status === "error") return

		const friendsIds = allChats.data.reduce((acc, chat) => {
			chat.users.forEach((user) => {
				if (user.id !== userId) {
					acc.push(user.id)
				}
			})
			return acc
		}, [] as number[])
		const usersStatus = friendsIds.map((id) => {
			const room = io.adapter.rooms.get(`user_${id}`)

			if (room) {
				return {
					status: "active",
					id,
				}
			} else {
				return {
					status: "deactive",
					id,
				}
			}
		})

		socket.emit("user:all-statuses", usersStatus)
		console.log(friendsIds)
	})
}
