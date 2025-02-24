"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
// import userRouter from "./src/routes/user"
const index_1 = __importDefault(require("./src/routes/index"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT) || 3001;
const mongoDB = "mongodb://127.0.0.1:27017/projectwork";
mongoose_1.default.connect(mongoDB);
mongoose_1.default.Promise = Promise;
const db = mongoose_1.default.connection;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// app.use("/api/user", userRouter)
app.use("/api", index_1.default);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
