import { Router } from "express";
import { chatController } from "./chat.controller";



const router = Router()


router.post("/get-chat", chatController.getChat)
router.get("/chats/:id", chatController.getIndividualChats)


export default router