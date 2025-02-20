import express, {Express} from "express"
import path from "path"
// import userRouter from "./src/routes/user"
// import router from "./src/routes/index"
import morgan from "morgan"
import dotenv from "dotenv"

dotenv.config()

const app: Express = express()
const port: number = parseInt(process.env.PORT as string) || 3001

app.use(express.json())
app.use(express.urlencoded({extended: false}))


// Provides info to the console about what's going on
app.use(morgan("dev"))

// If I want to use an html file for the project
app.use(express.static(path.join(__dirname, "../public")))
// app.use("/api/user", userRouter)
// app.use("/api", router)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})