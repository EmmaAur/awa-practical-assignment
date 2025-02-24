import express, {Express} from "express"
import path from "path"
// import userRouter from "./src/routes/user"
import router from "./src/routes/index"
import morgan from "morgan"
import dotenv from "dotenv"
import mongoose, {Connection} from "mongoose"

dotenv.config()

const app: Express = express()
const port: number = parseInt(process.env.PORT as string) || 3001


const mongoDB: string = "mongodb://127.0.0.1:27017/projectwork"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection


app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(morgan("dev"))

app.use(express.static(path.join(__dirname, "../public")))
// app.use("/api/user", userRouter)
app.use("/api", router)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})