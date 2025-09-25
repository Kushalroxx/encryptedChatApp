import { v4 as UUidv4 } from "uuid";

export class GenerateServerId {
    private static serverId = UUidv4();
    private constructor() {
    }
    static getServerId() {
        return this.serverId;
    }
}