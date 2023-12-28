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
const student_post_model_1 = __importDefault(require("../models/student_post_model "));
const base_controller_1 = __importDefault(require("./base_controller"));
// יצירת הקונטרולר הבסיסי
const StudentPostController = (0, base_controller_1.default)(student_post_model_1.default);
// הוספת פונקציונליות חדשה לקונטרולר
StudentPostController.getStudentPostsByOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield student_post_model_1.default.find({ owner: req.params.ownerId });
        if (posts.length === 0) {
            return res
                .status(404)
                .json({ message: `${req.params.owner} is not found` });
        }
        // console.log(...posts);
        res.send(posts);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = StudentPostController;
//# sourceMappingURL=student_post_controller.js.map