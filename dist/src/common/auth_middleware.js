"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
        return res.status(401).send("Token is null");
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req["user"] = verified;
        next();
    }
    catch (err) {
        return res.status(401).send("Token is invalid");
    }
};
exports.default = authMiddleware;
//# sourceMappingURL=auth_middleware.js.map