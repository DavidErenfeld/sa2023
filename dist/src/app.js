"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const student_routes_1 = __importDefault(require("./routes/student_routes"));
const student_post_routes_1 = __importDefault(require("./routes/student_post_routes"));
const initApp = () => {
    const db = mongoose_1.default.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("Connected to Database"));
    return new Promise((resolve, reject) => {
        mongoose_1.default
            .connect(process.env.DB_URL)
            .then(() => {
            app.use(body_parser_1.default.json());
            app.use(body_parser_1.default.urlencoded({ extended: true }));
            app.use("/student", student_routes_1.default);
            app.use("/studentPost", student_post_routes_1.default);
            resolve(app);
        })
            .catch((err) => {
            reject(err);
        });
    });
};
module.exports = initApp;
//# sourceMappingURL=app.js.map