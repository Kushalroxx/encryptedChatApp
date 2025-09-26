import WebSocket from "ws";
import { WebSocketType } from "../types/webSocket";
import { reAuthController } from "../controller/message/reAuth.controller";

export const wsMessageMiddleware = async(wss:WebSocket.Server,ws:WebSocketType)=>{
    ws.on("message", async(message) => {
       const msgString = message.toString();
       const msgJson = JSON.parse(msgString);
       switch(msgJson.type){
        case "reAuth":
            await reAuthController(ws,msgJson);
            break;
        case "ping":
            ws.send(JSON.stringify({ type: "pong" }));
            break;
        default:
            console.log("Unknown message type");
       }
    });
}