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
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        res.status(200).send({ accessToken: token });
    }
    catch (err) {
        return res.status(500).send("server error");
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("logout");
    res.status(400).send("logout");
});
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
exports.default = { login, logout, register };
//# sourceMappingURL=auth_controller.js.map