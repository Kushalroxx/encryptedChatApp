"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const client = (0, redis_1.createClient)({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-15816.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 15816
    }
});
client.on('error', err => console.log('Redis Client Error', err));
exports.default = client;
