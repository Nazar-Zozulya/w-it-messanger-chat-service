import { userToChatService } from "../../services/userToChat.service"
import { UserConsumerServices } from "../../types/kafka.types"
import { userConsumer as consumer } from "../kafka"


export async function startUserConsumer() {
    // подключает и подписывается
	await consumer.connect()

    // настройки подключения к топикам
	await consumer.subscribe({
		topic: "user.create",
		fromBeginning: true
	})

	await consumer.subscribe({
		topic: "user.change",
		fromBeginning: true
	})
	
	await consumer.subscribe({
		topic: "user.delete",
		fromBeginning: true
	})
	


    // запускает кафка клиента
	
	await consumer.run({
		// функция которая будет постоянно работаты при подписке
		eachMessage: async ({ topic, partition, message }) => {
			try {
				
				// переменная которая переводит json строку в обьект
				const payload = JSON.parse(
					message.value?.toString() || "{}"
				)
				switch(topic) {
					case "user.create":
						await userConsumerServices.createUser(payload)
						break
					case "user.change":
						await userConsumerServices.changeUser(payload)
						break
					case "user.delete":
						await userConsumerServices.deleteUser(payload)
						break
					default:
						console.log("we don\'t find this topic")
						break
				}
			} catch(err) {
				console.log(`Kafka error: ${err}`)
			}
		}
	})
}



/** СЕРВИСЫ **/


const userConsumerServices: UserConsumerServices = {
	createUser: async (payload) => {
        console.log("change user good: ", payload)
		await userToChatService.create(payload)
    },

    changeUser: async (payload) => {
        console.log("change user good: ", payload)
		await userToChatService.change(payload)
    },

	deleteUser: async ({id}) => {
		console.log("change user good: ", id)
		await userToChatService.delete({ id })
	}
}