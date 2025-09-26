import { TimerStore } from "../../lib/timerStore";
import { WebSocketType } from "../../types/webSocket";
import jwt from "jsonwebtoken";

export const reAuthController = async(ws:WebSocketType,msgJson:any)=>{
    if (!msgJson.accessToken) {
        ws.send(JSON.stringify({ type: "reAuthResponse", success: false, message: "No access token provided" }));
        return;
    }
    try {
        const decoded = jwt.verify(msgJson.accessToken as string, process.env.JWT_SECRET||"your_jwt_secret") as any
        if (!decoded || !decoded.id) {
            ws.send(JSON.stringify({ type: "reAuthResponse", success: false, message: "Invalid access token" }));
            return;
        }
        ws.user = decoded ;
        TimerStore.clearTimer(ws.user.id);
        const now = Math.floor(Date.now()/1000);
        const exp = decoded.exp-now;
        const timer = setTimeout(() => {
            ws.close(1008, "Authentication timeout");
        }, exp * 1000);
        TimerStore.setTimer(ws.user.id, timer);
        ws.send(JSON.stringify({ type: "reAuthResponse", success: true }));
    } catch (error) {
        ws.send(JSON.stringify({ type: "reAuthResponse", success: false, message: "Invalid access token" }));
    }
}