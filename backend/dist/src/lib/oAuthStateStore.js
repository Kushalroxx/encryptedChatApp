"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const redisConnection_1 = __importDefault(require("./redisConnection"));
const RedisStore = {
    store: function (req, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const state = crypto_1.default.randomBytes(16).toString("hex");
                const key = `oauth2state:${state}`;
                yield redisConnection_1.default.setEx(key, 600, "valid");
                cb(null, state);
            }
            catch (err) {
                cb(err);
            }
        });
    },
    verify: function (req, state, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!state)
                return cb(null, false);
            try {
                const key = `oauth2state:${state}`;
                const value = yield redisConnection_1.default.get(key);
                if (!value) {
                    return cb(null, false);
                }
                yield redisConnection_1.default.del(key);
                cb(null, true);
            }
            catch (err) {
                cb(err);
            }
        });
    },
};
exports.default = RedisStore;
