import { Server } from "http"
import { Socket } from "socket.io"
import { chatService } from "../../../chatApp/chat.service"

export function registerGlobalChatRoomHandler(io: Server, socket: Socket) {
	socket.on("globalChat:join", async (userId: number) => {
		socket.join(`user_${userId}`)
		socket.emit("join")
		console.log(
			`Пользователь ${socket.id} зашел в комнату чата: user_${userId}`,
		)
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
		console.log(friendsIds)

        friendsIds.map((id) => {
            socket.to(`user_${id}`).emit("user:active", userId)
        })
	})

	socket.on("globalChat:leave", async (userId: number) => {
		socket.leave(`user_${userId}`)
		socket.emit("leave")
		console.log(
			`Пользователь ${socket.id} покинул в комнату чата: user_${userId}`,
		)

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
		console.log(friendsIds)

        friendsIds.map((id) => {
            socket.to(`user_${id}`).emit("user:deactive", userId)
        })
        
	})

	socket.on("global-rooms", () => {
		console.log(socket.rooms)
		socket.emit("roomsList", JSON.stringify(socket.rooms))
	})
}
