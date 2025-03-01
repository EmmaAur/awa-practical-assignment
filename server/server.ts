import express, {Express} from "express"
import path from "path"
import userRouter from "./src/routes/user"
import cardRouter from "./src/routes/cards"
import commentRouter from "./src/routes/comments"
import columnRouter from "./src/routes/columns"
import morgan from "morgan"
import dotenv from "dotenv"
import mongoose, {Connection} from "mongoose"
import cors, {CorsOptions} from 'cors'

dotenv.config()

const app: Express = express()
const port: number = parseInt(process.env.PORT as string) || 3000

// Initialize the mongodb connection
const mongoDB: string = "mongodb://127.0.0.1:27017/projectwork"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error."))


// cors options
const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan("dev"))

// Define the router paths
app.use(express.static(path.join(__dirname, "../public")))
app.use("/", columnRouter)
app.use("/", userRouter)
app.use("/", cardRouter)
app.use("/", commentRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})