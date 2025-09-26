import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";
import { WebSocketType } from "../types/webSocket";
import { TimerStore } from "../lib/timerStore";
import WebSocket from "ws";
import { RedisStore } from "../lib/redisStore";

export const wsAuthMiddleware = async(wss:WebSocket.Server<typeof WebSocket, typeof IncomingMessage>,ws:WebSocketType,req:IncomingMessage)=>{

    const cookies = req.headers.cookie;
    if (!cookies) {
        ws.close(1008, "No cookies provided");
        return
    }
    const accessToken = cookies?.split("; ").find((cookie) => cookie.startsWith("accessToken="))?.split("=")[1];

    if (!accessToken) {
        ws.close(1008, "No access token provided");
        return
    }

    try {
        const decoded = jwt.verify(accessToken as string, process.env.JWT_SECRET||"your_jwt_secret")
        ws.user = decoded ;

        const timer = setTimeout(() => {
            ws.close(1008, "Authentication timeout");
        }, 15 * 60 * 1000);
        TimerStore.setTimer(ws.user.id, timer);
        await RedisStore.setActiveUser(ws.user.id);
        
        ws.on("close", async() => {
            TimerStore.clearTimer(ws.user.id);
            await RedisStore.removeActiveUser(ws.user.id);
        });
        return;
    } catch (error) {
        ws.close(1008, "Invalid token");
        return
    }   
}