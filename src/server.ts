import express, { Express } from "express"
import cors from "cors"
import { createSocket } from './socket'
import { createServer } from "http"
import { connectProducer } from "./kafka/services/producer"
import { startUserConsumer } from "./kafka/services/userConsumer"



const app: Express = express()
const PORT: number = Number(process.env.PORT) || 8002

const HOST: string = process.env.HOST || "0.0.0.0"

app.use(
	cors({
		origin: "http://localhost:3000",
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		credentials: true,
	}),
)



app.use(express.json())


app.get("/api/chat/health", (req, res) => {res.status(200).send("OK")})


const server = createServer(app)

async function start() {
	await connectProducer()
	await startUserConsumer()
	createSocket(server)

	server.listen(PORT, HOST, () => {
		console.log(`Server started at http://${HOST}:${PORT}`)
	})
}

start()
