"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const student_post_controller_1 = __importDefault(require("../controllers/student_post_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
router.get("/", student_post_controller_1.default.get.bind(student_post_controller_1.default));
// router.get(
//   "/owner/:ownerId",
//   (StudentPostController as any).getStudentPostsByOwner.bind(
//     StudentPostController
//   )
// );
router.get("/:id", student_post_controller_1.default.getById.bind(student_post_controller_1.default));
router.post("/", auth_middleware_1.default, student_post_controller_1.default.post.bind(student_post_controller_1.default));
router.put("/:id", auth_middleware_1.default, student_post_controller_1.default.putById.bind(student_post_controller_1.default));
router.delete("/:id", auth_middleware_1.default, student_post_controller_1.default.deleteById.bind(student_post_controller_1.default));
module.exports = router;
//# sourceMappingURL=student_post_routes.js.map