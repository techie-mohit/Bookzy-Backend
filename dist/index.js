"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dbConnect_1 = __importDefault(require("./config/dbConnect"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const wishlistRoutes_1 = __importDefault(require("./routes/wishlistRoutes"));
const addressRoutes_1 = __importDefault(require("./routes/addressRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const googleStrategy_1 = __importDefault(require("./controllers/strategy/googleStrategy"));
dotenv_1.default.config({ override: true });
const Port = process.env.PORT || 8000;
const app = (0, express_1.default)();
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true, // Allow credentials
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json()); // it ensure data will be return in json format
app.use(express_1.default.urlencoded({ extended: true }));
app.use(googleStrategy_1.default.initialize());
app.use((0, cookie_parser_1.default)()); // Parse cookies
// api endpoints
app.use("/api/auth", authRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/cart", cartRoutes_1.default);
app.use("/api/wishlist", wishlistRoutes_1.default);
app.use("/api/user/address", addressRoutes_1.default);
app.use("/api/user", userRoutes_1.default);
app.use("/api/order", orderRoutes_1.default);
app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
    (0, dbConnect_1.default)();
});
