import { Kafka } from "kafkajs"


// создание кафка клиента
export const kafka = new Kafka({
	clientId: "chat-service",
	brokers: ["localhost:9092"]
})


// создание продюсера
export const producer = kafka.producer()

// создание подписки к юзер сервису
export const userConsumer = kafka.consumer({
	groupId: "chat-service"
})

// export const chatConsumer = kafka.consumer({
    // groupId: "post-service"
// })