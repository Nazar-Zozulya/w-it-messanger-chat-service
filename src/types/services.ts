import { Prisma } from "../generated/prisma"
import { ChangeUserToChatCredentials, CreateUserToChatCredentials } from "./userToChat.types"


export interface UserToChatService {
    create: (credentials: CreateUserToChatCredentials) => void
    change: (credentials: ChangeUserToChatCredentials) => void
    delete: (credentials: { id: number }) => void
}