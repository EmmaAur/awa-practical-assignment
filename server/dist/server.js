"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const user_1 = __importDefault(require("./src/routes/user"));
const cards_1 = __importDefault(require("./src/routes/cards"));
const comments_1 = __importDefault(require("./src/routes/comments"));
const columns_1 = __importDefault(require("./src/routes/columns"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT) || 3000;
// Initialize the mongodb connection
const mongoDB = "mongodb://127.0.0.1:27017/projectwork";
mongoose_1.default.connect(mongoDB);
mongoose_1.default.Promise = Promise;
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "MongoDB connection error."));
// cors options
const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, morgan_1.default)("dev"));
// Define the router paths
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use("/", columns_1.default);
app.use("/", user_1.default);
app.use("/", cards_1.default);
app.use("/", comments_1.default);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
