import { Server, Socket } from "socket.io";

export function registerConnectionHandler(io: Server) {
	io.on("connection", (socket: Socket) => {
		console.log("connected:", socket.id);

		socket.on("disconnect", () => {
			console.log("disconnected:", socket.id);
		});
	});
}
