import { Server } from "http"
import { Socket } from "socket.io"
import { chatRepository } from "../../../chatApp/chat.repository"

interface SendMessagePayload {
	chatId: number
	receiverId: number
	senderId: number
	text: string
}

export function registerChatMessageHandler(io: Server, socket: Socket) {
	// async function sendMessage(data: string) {
	// 	console.log(67676767676767)
	// 	console.log(data)
	// 	socket.emit("evev", "!23")
	// }

	// socket.on("send", sendMessage)

	socket.on("message:send", async (data, callback) => {
	const { text, senderId, chatId } = data

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

	// 💥 если хочешь чтобы отправитель тоже получил — добавь это:
	socket.emit("message:new", newMessage.data)

	callback?.({
		status: "success",
		data: newMessage.data,
	})
})
}
