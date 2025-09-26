"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const addressController_1 = require("../controllers/addressController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
router.post("/create-or-update", authMiddleware_1.default, addressController_1.createOrUpdateAddressByUserId);
router.get("/", authMiddleware_1.default, addressController_1.getAddressByUserId);
exports.default = router;
