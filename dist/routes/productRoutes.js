"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const cloudinaryConfig_1 = require("../config/cloudinaryConfig");
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.default, cloudinaryConfig_1.multerMiddleware, productController_1.createProduct);
router.get('/', authMiddleware_1.default, productController_1.getAllProducts);
router.get('/seller/:sellerId', authMiddleware_1.default, productController_1.getProductBySellerId);
router.get('/:id', authMiddleware_1.default, productController_1.getProductById);
router.delete('/delete/:productId', authMiddleware_1.default, productController_1.deleteProduct);
exports.default = router;
