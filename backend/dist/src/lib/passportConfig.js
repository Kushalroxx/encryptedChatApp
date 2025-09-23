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
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const prisma_1 = __importDefault(require("../../prisma"));
require("dotenv/config");
const oAuthStateStore_1 = __importDefault(require("./oAuthStateStore"));
const GoogleStrategy = passport_google_oauth20_1.default.Strategy;
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: `${process.env.HOST_URL}/api/auth/callback/google`,
    state: true,
    store: oAuthStateStore_1.default,
    passReqToCallback: true
}, function (request, accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!profile.emails) {
            return done(null, false);
        }
        try {
            const existedUser = yield prisma_1.default.user.findFirst({
                where: {
                    email: profile.emails[0].value
                }
            });
            if (existedUser) {
                return done(null, existedUser);
            }
            const user = yield prisma_1.default.user.create({
                data: {
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    image: profile.photos && profile.photos[0].value
                }
            });
            return done(null, user);
        }
        catch (error) {
            return done(error, false);
        }
    });
}));
