import { Server, Socket } from "socket.io"
import http from "http"
import { registerMessageHandler } from "./handlers/message.handler"

export function createSocket(server: http.Server) {
	const io = new Server(server, {
		cors: {
			origin: "*",
		},
	})
	io.on("connection", (socket: Socket) => {
		console.log(123123)

		registerMessageHandler(server, socket)

		socket.on("disconnect", () => {
			console.log(`User disconnected: ${socket.id}`)
		})
	})

	return io
}
