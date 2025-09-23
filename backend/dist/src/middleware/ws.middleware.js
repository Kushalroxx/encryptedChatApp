"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsMiddleware = void 0;
const wsMiddleware = (ws, req) => {
    const cookies = req.headers.cookie;
    console.log(cookies);
};
exports.wsMiddleware = wsMiddleware;
