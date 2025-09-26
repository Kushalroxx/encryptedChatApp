import express from "express";
import passport from "passport";
import { createServer } from "http";
import "./lib/passportConfig";
import cookieParser from "cookie-parser";
import { googleLoginController } from "./controller/auth/googleLogin.controller";
import { WebSocketServer } from "ws";
import { wsAuthMiddleware } from "./middleware/wsAuth.middleware";
import { WebSocketType } from "./types/webSocket";
import { wsMessageMiddleware } from "./middleware/wsMessage.middleware";
import { logoutController } from "./controller/auth/logout.controller";
import { refreshController } from "./controller/auth/refresh.controller";

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

app.get('/api/auth/google',
  passport.authenticate('google', { scope: ["email",'profile'] }));

app.get('/api/auth/callback/google', 
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),googleLoginController);
app.get("/api/auth/logout", logoutController);
app.get("/api/refresh", refreshController);
app.get("/", (req, res) => {
    res.send("Hello World!");
});

const server = createServer(app);
const wss = new WebSocketServer({ server });
wss.on("connection", async(ws,req) => {
  await wsAuthMiddleware(wss, ws as WebSocketType,req);
   await wsMessageMiddleware(wss, ws as WebSocketType);
});
export default server;