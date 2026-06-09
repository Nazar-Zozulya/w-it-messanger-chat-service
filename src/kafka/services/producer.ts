import { producer } from "../kafka"

// функция подключения к продюсеру (будет вызвана в server.ts)
export async function connectProducer() {
	await producer.connect()
	console.log("Producer connected")
}


/** Функции продюсера */