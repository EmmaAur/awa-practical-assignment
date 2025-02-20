"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
// import userRouter from "./src/routes/user"
// import router from "./src/routes/index"
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT) || 3001;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// Provides info to the console about what's going on
app.use((0, morgan_1.default)("dev"));
// If I want to use an html file for the project
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// app.use("/api/user", userRouter)
// app.use("/api", router)
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
