import { GenerateServerId } from "./generateServerId";
import client from "./redisConnection";

export class RedisStore {
    private constructor() {
    }
    static async setActiveUser(userId: string) {
        const serverId = GenerateServerId.getServerId()
        await client.hSet("activeUsers", userId, serverId);
    }
    static async removeActiveUser(userId: string) {
        await client.hDel("activeUsers", userId);
    }
    static async getActiveUsers() {
        const activeUsers = await client.hGetAll("activeUsers");
        return activeUsers;
    }
    static async isActiveUser(userId: string) {
        const isActive = await client.hExists("activeUsers", userId);
        return isActive;
    }
}