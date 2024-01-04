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
const student_post_model_1 = __importDefault(require("../models/student_post_model "));
const base_controller_1 = require("./base_controller");
// יצירת הקונטרולר הבסיסי
class StudentPostController extends base_controller_1.BaseController {
    constructor(model) {
        super(model);
    }
    post(req, res) {
        const _super = Object.create(null, {
            post: { get: () => super.post }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user._id;
            const message = req.body;
            message.owner = userId;
            _super.post.call(this, req, res);
        });
    }
    putById(req, res) {
        const _super = Object.create(null, {
            putById: { get: () => super.putById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user._id;
            const message = req.body;
            message.owner = userId;
            _super.putById.call(this, req, res);
        });
    }
}
exports.default = new StudentPostController(student_post_model_1.default);
// הוספת פונקציונליות חדשה לקונטרולר
// (StudentPostController as any).getStudentPostsByOwner = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const posts = await StudentPost.find({ owner: req.params.ownerId });
//     if (posts.length === 0) {
//       return res
//         .status(404)
//         .json({ message: `${req.params.owner} is not found` });
//     }
//     // console.log(...posts);
//     res.send(posts);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
//# sourceMappingURL=student_post_controller.js.map