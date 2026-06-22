import { Router } from "express"
import { chatController } from "./chat.controller"

const router = Router()

router.post("/get-chat", chatController.getChat)
router.get("/chats/:id", chatController.getIndividualChats)

router.post("/group/create", chatController.createGroup)
router.get("/group/:id", chatController.getGroup)
router.get("/groups/:id", chatController.getAllGroups)

export default router
