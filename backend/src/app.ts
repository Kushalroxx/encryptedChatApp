import express from "express";
import passport from "passport";
import { createServer } from "http";
import "./lib/passportConfig";
import cookieParser from "cookie-parser";
import { googleLoginController } from "./controller/googleLogin.controller";
import { WebSocketServer } from "ws";
import { wsMiddleware } from "./middleware/ws.middleware";

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

app.get('/api/auth/google',
  passport.authenticate('google', { scope: ["email",'profile'] }));

app.get('/api/auth/callback/google', 
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),googleLoginController);
app.get("/", (req, res) => {
    res.send("Hello World!");
});

const server = createServer(app);
const wss = new WebSocketServer({ server });
wss.on("connection", (ws,req) => {
  wsMiddleware(ws,req);
    console.log("Client connected");
    ws.on("message", (message) => {
        console.log(`Received message => ${message}`);
    });
    ws.send("Hello! Message From Server!!");
});
export default server;