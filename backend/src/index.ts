import app from "./app";
import "dotenv/config";
import client from "./lib/redisConnection";

const port = process.env.PORT || 3000;
app.listen(port, async() => {
    await client.connect();
    console.log(`Server running on port ${port}`);
});
