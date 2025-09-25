import app from "./app";
import "dotenv/config";
import client from "./lib/redisConnection";

const port = process.env.PORT || 3000;
const startServer = async () => {
    try {
        await client.connect();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to connect to Redis", error);
        process.exit(1);
    }
};

startServer();