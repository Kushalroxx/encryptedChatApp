import { IncomingMessage } from "http";
import { WebSocket } from "ws";

export const wsMiddleware = (ws:WebSocket,req:IncomingMessage)=>{
    const cookies = req.headers.cookie;
    console.log(cookies);
    
}