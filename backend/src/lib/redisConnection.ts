import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password:process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-15816.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 15816
    }
});

client.on('error', err => console.log('Redis Client Error', err));

export default client;