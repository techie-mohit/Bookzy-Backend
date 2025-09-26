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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../../models/User"));
dotenv_1.default.config();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
    passReqToCallback: true
}, (req, accessToken, refreshToken, // refreshToken use when we want to use only google auth then no need of jwt 
profile, callback) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { emails, name, photos } = profile;
    console.log("Google profile information:", profile);
    try {
        let user = yield User_1.default.findOne({ email: emails && emails[0].value });
        if (user) {
            if (!user.profilePicture && ((_a = photos === null || photos === void 0 ? void 0 : photos[0]) === null || _a === void 0 ? void 0 : _a.value)) {
                user.profilePicture = (_b = photos === null || photos === void 0 ? void 0 : photos[0]) === null || _b === void 0 ? void 0 : _b.value;
                yield user.save();
            }
            return callback(null, user);
        }
        user = yield User_1.default.create({
            googleId: profile.id,
            email: (_c = emails === null || emails === void 0 ? void 0 : emails[0]) === null || _c === void 0 ? void 0 : _c.value,
            name: name,
            profilePicture: (_d = photos === null || photos === void 0 ? void 0 : photos[0]) === null || _d === void 0 ? void 0 : _d.value,
            isVerified: (_e = emails === null || emails === void 0 ? void 0 : emails[0]) === null || _e === void 0 ? void 0 : _e.verified,
            agreeToTerms: true,
        });
        callback(null, user);
    }
    catch (error) {
        callback(error);
    }
})));
exports.default = passport_1.default;
