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
const user_model_1 = __importDefault(require("../models/user_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("register");
    const email = req.body.email;
    const password = req.body.password;
    if (email == null || password == null) {
        return res.status(400).send("email or password is null");
    }
    try {
        const existUser = yield user_model_1.default.findOne({ email: email });
        if (existUser != null) {
            return res.status(400).send("email is exist");
        }
    }
    catch (err) {
        res.status(500).send("server error");
    }
    try {
        const salt = yield bcrypt_1.default.genSalt();
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield user_model_1.default.create({
            email: email,
            password: hashedPassword,
        });
        res.status(200).send(user);
    }
    catch (err) {
        res.status(500).send("Server error");
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("login");
    const email = req.body.email;
    const password = req.body.password;
    if (email == null || password == null) {
        return res.status(400).send("email or password is null");
    }
    try {
        const user = yield user_model_1.default.findOne({ email: email });
        if (user == null) {
            return res.status(400).send("bad email or password");
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("password is not match");
        }
        // Create accessToken
        const accessToken = yield jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
        // Create refreshToken
        const refreshToken = yield jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
        // Put refreshToken in the DB
        if (user.tokens == null) {
            user.tokens = [refreshToken];
        }
        else {
            user.tokens.push(refreshToken);
        }
        yield user.save();
        res.status(200).send({
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    }
    catch (err) {
        return res.status(500).send("server error");
    }
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (refreshToken == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        try {
            const userDb = yield user_model_1.default.findOne({ _id: user._id });
            if (!userDb.tokens || !userDb.tokens.includes(refreshToken)) {
                userDb.tokens = [];
                yield userDb.save();
                return res.sendStatus(401);
            }
            const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            const newRefreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
            userDb.tokens = userDb.tokens.filter((t) => t !== refreshToken);
            userDb.tokens.push(newRefreshToken);
            yield userDb.save();
            return res.status(200).send({
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        }
        catch (err) {
            res.sendStatus(401).send(err.message);
        }
    }));
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (refreshToken == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.sendStatus(401);
        try {
            const userDb = yield user_model_1.default.findOne({ _id: user._id });
            if (!userDb.tokens || !userDb.tokens.includes(refreshToken)) {
                userDb.tokens = [];
                yield userDb.save();
                return res.sendStatus(401);
            }
            else {
                userDb.tokens = userDb.tokens.filter((t) => t !== refreshToken);
                yield userDb.save();
                return res.sendStatus(200);
            }
        }
        catch (err) {
            res.sendStatus(401).send(err.message);
        }
    }));
});
exports.default = { login, logout, register, refresh };
//# sourceMappingURL=auth_controller.js.map