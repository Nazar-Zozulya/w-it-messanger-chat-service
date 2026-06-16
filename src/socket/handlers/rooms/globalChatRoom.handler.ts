import { Server } from "http";
import { Socket } from "socket.io";

export function registerGlobalChatRoomHandler(io: Server, socket: Socket) {
    socket.on("globalChat:join", (userId: number) => {
        socket.join(`user_${userId}`)
		socket.emit("join")
        console.log(`Пользователь ${socket.id} зашел в комнату чата: user_${userId}`)
    } ) 

    socket.on("globalChat:leave", (userId: number) => {
        socket.leave(`user_${userId}`)
		socket.emit("leave")
        console.log(`Пользователь ${socket.id} покинул в комнату чата: user_${userId}`)
    } ) 

    socket.on("global-rooms", () => {
        console.log(socket.rooms);
        socket.emit("roomsList", JSON.stringify(socket.rooms))
    } ) 
}