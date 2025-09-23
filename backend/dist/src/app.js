"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const http_1 = require("http");
require("./lib/passportConfig");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const googleLogin_controller_1 = require("./controller/googleLogin.controller");
const ws_1 = require("ws");
const ws_middleware_1 = require("./middleware/ws.middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use((0, cookie_parser_1.default)());
app.get('/api/auth/google', passport_1.default.authenticate('google', { scope: ["email", 'profile'] }));
app.get('/api/auth/callback/google', passport_1.default.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }), googleLogin_controller_1.googleLoginController);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
const server = (0, http_1.createServer)(app);
const wss = new ws_1.WebSocketServer({ server });
wss.on("connection", (ws, req) => {
    (0, ws_middleware_1.wsMiddleware)(ws, req);
    console.log("Client connected");
    ws.on("message", (message) => {
        console.log(`Received message => ${message}`);
    });
    ws.send("Hello! Message From Server!!");
});
exports.default = server;
