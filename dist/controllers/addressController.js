"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressByUserId = exports.createOrUpdateAddressByUserId = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const Address_1 = __importDefault(require("../models/Address"));
const User_1 = __importDefault(require("../models/User"));
const createOrUpdateAddressByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        console.log(req.body);
        const { addressLine1, addressLine2, phoneNumber, city, state, pincode, addressId } = req.body;
        if (!userId) {
            return (0, responseHandler_1.response)(res, 400, "User Not Found, Please a provide a valid id");
        }
        if (!addressLine1 || !phoneNumber || !city || !state || !pincode) {
            return (0, responseHandler_1.response)(res, 400, "Please provide all required fields");
        }
        if (addressId) {
            const existingAddress = yield Address_1.default.findById(addressId);
            if (!existingAddress) {
                return (0, responseHandler_1.response)(res, 404, "Address Not Found");
            }
            existingAddress.addressLine1 = addressLine1;
            existingAddress.addressLine2 = addressLine2;
            existingAddress.phoneNumber = phoneNumber;
            existingAddress.city = city;
            existingAddress.state = state;
            existingAddress.pincode = pincode;
            yield existingAddress.save();
            return (0, responseHandler_1.response)(res, 200, "Address Updated Successfully", existingAddress);
        }
        else {
            const newAddress = new Address_1.default({
                user: userId,
                addressLine1,
                addressLine2,
                phoneNumber,
                city,
                state,
                pincode
            });
            yield newAddress.save();
            yield User_1.default.findByIdAndUpdate(userId, { $push: { addresses: newAddress._id } }, { new: true });
            return (0, responseHandler_1.response)(res, 201, "Address Created Successfully", newAddress);
        }
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.createOrUpdateAddressByUserId = createOrUpdateAddressByUserId;
const getAddressByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        if (!userId) {
            return (0, responseHandler_1.response)(res, 400, "User Not Found, Please a provide a valid id");
        }
        const address = yield User_1.default.findById(userId).populate('addresses');
        if (!address) {
            return (0, responseHandler_1.response)(res, 400, 'User Address Not found');
        }
        return (0, responseHandler_1.response)(res, 200, "User Address Get  Successfully", address);
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.getAddressByUserId = getAddressByUserId;
