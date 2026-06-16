import { Server, Socket } from "socket.io"
import http from "http"
import {
	registerChatMessageHandler,
	registerGlobalChatMessageHandler,
} from "./handlers/messages"
import {
	registerChatRoomHandler,
	registerGlobalChatRoomHandler,
} from "./handlers/rooms"

export function createSocket(server: http.Server) {
	const io = new Server(server, {
		cors: {
			origin: "*",
		},
	})

	const globalChatSocket = io.of("/global")
	globalChatSocket.on("connection", (socket: Socket) => {
		console.log("User global connected")

		registerGlobalChatMessageHandler(server, socket)
		registerGlobalChatRoomHandler(server, socket)
		
		socket.on("disconnect", () => {
			console.log(`User global disconnected: ${socket.id}`)
		})
		
	})

	const chatSocket = io.of("/chat")
	chatSocket.on("connection", (socket: Socket) => {
		console.log("User chat connected")

		registerChatMessageHandler(io, socket)
		registerChatRoomHandler(socket)

		socket.on("disconnect", () => {
			console.log(`User chat disconnected: ${socket.id}`)
		})

	})

	return io
}
