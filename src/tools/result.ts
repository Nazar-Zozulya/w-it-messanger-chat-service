import { Success, Error } from "../types/result"

export function success<T>(data: T): Success<T> {
	return { status: "success", data: data }
}

export function error(message?: string, code?: number): Error {
	return { status: "error", message: message, code: code }
}
