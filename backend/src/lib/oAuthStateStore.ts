import crypto from "crypto";
import client from "./redisConnection";

const RedisStore = {
  store: async function (req: any, cb: any) {
    try {
      const state = crypto.randomBytes(16).toString("hex");
      const key = `oauth2state:${state}`;
      await client.setEx(key, 600, "valid");
      cb(null, state);
    } catch (err) {
      cb(err);
    }
  },

  verify: async function (req: any, state: string, cb: any) {
    if (!state) return cb(null, false);

    try {
      const key = `oauth2state:${state}`;
      const value = await client.get(key);
      if (!value) {
        return cb(null, false);
      }
      await client.del(key);
      cb(null, true);
    } catch (err) {
      cb(err);
    }
  },
};

export default RedisStore;
