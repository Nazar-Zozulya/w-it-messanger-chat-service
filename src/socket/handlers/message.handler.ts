import { Server } from "http";
import { Socket } from "socket.io";


export const registerMessageHandler = (io: Server, socket: Socket) => {
    async function sendMessage (data:string) {
        console.log(67676767676767)
        console.log(data)
        socket.emit("evev", "!23")
    }

    socket.on("send", sendMessage)
}