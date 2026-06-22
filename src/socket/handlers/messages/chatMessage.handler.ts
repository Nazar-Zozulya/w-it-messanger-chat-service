import { Namespace, Server, Socket } from "socket.io"
import { chatRepository } from "../../../chatApp/chat.repository"

interface SendMessagePayload {
	chatId: number
	receiverId: number
	senderId: number
	text: string
}

interface SendGroupMessagePayload {
	chatId: number
	receiversIds: number[]
	senderId: number
	text: string
}

interface SeeMessagePayload {
	messageId: number
	readerId: number
}

export function registerChatMessageHandler(
	namespace: Namespace,
	socket: Socket,
	io: Server,
) {
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

		// отправляет всем в чате
		socket.to(`chat_${chatId}`).emit("message:new", newMessage.data)

		// пушит оповещение для других
		io.of("/global")
			.to(`user_${receiverId}`)
			.emit("global-message:new", newMessage.data)

		// пишет отправителю если сообщение успешно
		socket.emit("message:new", newMessage.data)

		callback?.({
			status: "success",
			data: newMessage.data,
		})
	})

	socket.on(
		"message-group:send",
		async (data: SendGroupMessagePayload, callback) => {
			const { text, senderId, chatId, receiversIds } = data

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

			// отправляет всем в чате
			socket.to(`chat_${chatId}`).emit("message-group:new", newMessage.data)

			// пушит оповещение для других
			receiversIds.map((id) => {
				return io
					.of("/global")
					.to(`user_${id}`)
					.emit("global-message-group:new", newMessage.data)
			})

			// пишет отправителю если сообщение успешно
			socket.emit("message-group:new", newMessage.data)

			callback?.({
				status: "success",
				data: newMessage.data,
			})
		},
	)

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

	socket.on("message-group:see", async (data: SeeMessagePayload, callback) => {
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
			.emit("message-group:saw", newMessage.data)

		// 💥 если хочешь чтобы отправитель тоже получил — добавь это:
		socket.emit("message-group:saw", newMessage.data)

		callback?.({
			status: "success",
			data: newMessage.data,
		})
	})
}
