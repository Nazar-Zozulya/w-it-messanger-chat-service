import { Server, Socket } from "socket.io";

export function registerChatRoomHandler(socket: Socket) {
    socket.on("chat:join", (chatId: number) => {
        socket.join(`chat_${chatId}`)
		socket.emit("join")
        console.log(`Пользователь ${socket.id} зашел в комнату чата: chat_${chatId}`)
    } ) 

    socket.on("chat:leave", (chatId: number) => {
        socket.leave(`chat_${chatId}`)
		socket.emit("leave")
        console.log(`Пользователь ${socket.id} покинул в комнату чата: chat_${chatId}`)
    } ) 

    socket.on("rooms", () => {
        console.log(socket.rooms);
        socket.emit("roomsList", JSON.stringify(socket.rooms))
    } ) 
}