import { Server, Socket } from "socket.io"
import { chatRepository } from "../../../chatApp/chat.repository"

interface SendMessagePayload {
	chatId: number
	receiverId: number
	senderId: number
	text: string
}

interface SeeMessagePayload {
	messageId: number
	readerId: number
}

export function registerChatMessageHandler(io: Server, socket: Socket) {
	// async function sendMessage(data: string) {
	// 	console.log(67676767676767)
	// 	console.log(data)
	// 	socket.emit("evev", "!23")
	// }

	// socket.on("send", sendMessage)

	socket.on("message:send", async (data: SendMessagePayload, callback) => {
		const { text, senderId, chatId, receiverId } = data

		const newMessage = await chatRepository.createMessage({
			text,
			senderId,
			chatId,
		})

		if (newMessage.status === "error") {
			return callback?.({
				status: "error",
				message: "message send failed",
			})
		}

		// 💥 отправить ВСЕМ В ЧАТЕ КРОМЕ ОТПРАВИТЕЛЯ
		socket.to(`chat_${chatId}`).emit("message:new", newMessage.data)

		io.of("/global")
			.to(`user_${receiverId}`)
			.emit("global-message:new", newMessage.data)

		// 💥 если хочешь чтобы отправитель тоже получил — добавь это:
		socket.emit("message:new", newMessage.data)

		callback?.({
			status: "success",
			data: newMessage.data,
		})
	})

	socket.on("message:see", async (data: SeeMessagePayload, callback) => {
		const { messageId, readerId } = data

		const newMessage = await chatRepository.seeMessage({
			messageId,
			readerId,
		})

		if (newMessage.status === "error") {
			return callback?.({
				status: "error",
				message: "message send failed",
			})
		}

		socket
			.to(`chat_${newMessage.data.chatId}`)
			.emit("message:saw", newMessage.data)

		// 💥 если хочешь чтобы отправитель тоже получил — добавь это:
		socket.emit("message:saw", newMessage.data)

		callback?.({
			status: "success",
			data: newMessage.data,
		})
	})
}
