import { ChangeUserToChatCredentials, CreateUserToChatCredentials } from "./userToChat.types"

export interface UserToChatRepository {
    create: (credentials: CreateUserToChatCredentials) => void
    change: (credentials: ChangeUserToChatCredentials) => void
    delete: (id: number) => void
}