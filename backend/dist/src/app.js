"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
require("./lib/passportConfig");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../prisma"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use((0, cookie_parser_1.default)());
app.get('/api/auth/google', passport_1.default.authenticate('google', { scope: ["email", 'profile'] }));
app.get('/api/auth/callback/google', passport_1.default.authenticate('google', { session: false, failureRedirect: '/login' }), function (req, res) {
    var _a, _b, _c, _d, _e, _f, _g;
    const accessToken = jsonwebtoken_1.default.sign({
        id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        email: (_b = req.user) === null || _b === void 0 ? void 0 : _b.email,
        name: (_c = req.user) === null || _c === void 0 ? void 0 : _c.name,
    }, process.env.JWT_ACCESS_SECRET || "your secret access key", {
        expiresIn: "1d"
    });
    const refreshToken = jsonwebtoken_1.default.sign({
        id: (_d = req.user) === null || _d === void 0 ? void 0 : _d.id,
        email: (_e = req.user) === null || _e === void 0 ? void 0 : _e.email,
        name: (_f = req.user) === null || _f === void 0 ? void 0 : _f.name,
    }, process.env.JWT_REFRESH_SECRET || "your secret refresh key", {
        expiresIn: "30d"
    });
    try {
        prisma_1.default.user.update({
            where: {
                id: (_g = req.user) === null || _g === void 0 ? void 0 : _g.id
            },
            data: {
                refreshToken
            }
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.ENV === "production",
            domain: process.env.DOMAIN
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.ENV === "production",
            domain: process.env.DOMAIN
        });
    }
    catch (error) {
    }
});
app.get("/", (req, res) => {
    res.send("Hello World!");
});
exports.default = app;
