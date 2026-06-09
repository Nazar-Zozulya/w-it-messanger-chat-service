import { Prisma } from "../generated/prisma"

export type UserToChat = Prisma.UserToChatGetPayload<{}>

export type CreateUserToChatCredentials = Prisma.UserToChatGetPayload<{}>
export type ChangeUserToChatCredentials = Partial<Prisma.UserToChatGetPayload<{}>>