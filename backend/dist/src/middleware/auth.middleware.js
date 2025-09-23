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
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_js_1 = __importDefault(require("../../prisma/index.js"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if (!accessToken || !refreshToken) {
        res.status(401).json({ message: "unautharised", success: false });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_SECRET || "your secret access key");
        req.user = payload;
        next();
        return;
    }
    catch (error) {
        try {
            const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "your secret refresh key");
            req.user = payload;
            const newAccessToken = jsonwebtoken_1.default.sign({ id: payload.id }, process.env.JWT_ACCESS_SECRET || "your secret access key", { expiresIn: "15m" });
            const newRefreshToken = jsonwebtoken_1.default.sign({ id: payload.id }, process.env.JWT_REFRESH_SECRET || "your secret refresh key", { expiresIn: "30d" });
            yield index_js_1.default.user.update({
                where: { id: payload.id },
                data: { refreshToken: newRefreshToken }
            });
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000,
                domain: process.env.DOMAIN
            });
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000,
                domain: process.env.DOMAIN
            });
            next();
            return;
        }
        catch (error) {
            res.status(401).json({ message: "unautharised", success: false });
        }
    }
});
exports.authMiddleware = authMiddleware;
