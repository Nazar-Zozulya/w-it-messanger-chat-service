import { ChangeUserToChatCredentials, CreateUserToChatCredentials } from "./userToChat.types"

export interface UserConsumerServices {
	createUser: (payload: CreateUserToChatCredentials) => void
	changeUser: (payload: ChangeUserToChatCredentials) => void
	deleteUser: (payload: { id: number }) => void
}
