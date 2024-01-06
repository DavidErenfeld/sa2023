"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const student_post_controller_1 = __importDefault(require("../controllers/student_post_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
/**
 * @swagger
 * components:
 *   schemas:
 *     StudentPost:
 *       type: object
 *       required:
 *         - owner
 *         - title
 *         - content
 *       properties:
 *         owner:
 *           type: string
 *           description: The owner ID of the post
 *         title:
 *           type: string
 *           description: The title of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *       example:
 *         owner: "12345"
 *         title: "A new post"
 *         content: "Content of the new post"
 */
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
 * @swagger
 * /studentPost:
 *   get:
 *     summary: Retrieves a list of student posts
 *     tags: [StudentPost]
 *     responses:
 *       200:
 *         description: A list of student posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StudentPost'
 */
router.get("/", student_post_controller_1.default.get.bind(student_post_controller_1.default));
/**
 * @swagger
 * /studentPost/{id}:
 *   get:
 *     summary: Retrieves a student post by ID
 *     tags: [StudentPost]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the student post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of a student post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentPost'
 *       404:
 *         description: Student post not found
 */
router.get("/:id", student_post_controller_1.default.getById.bind(student_post_controller_1.default));
/**
 * @swagger
 * /studentPost:
 *   post:
 *     summary: Creates a new student post
 *     tags: [StudentPost]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentPost'
 *     responses:
 *       200:
 *         description: New student post created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentPost'
 */
router.post("/", auth_middleware_1.default, student_post_controller_1.default.post.bind(student_post_controller_1.default));
/**
 * @swagger
 * /studentPost/{id}:
 *   put:
 *     summary: Updates a student post's details
 *     tags: [StudentPost]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the student post
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentPost'
 *     responses:
 *       200:
 *         description: Student post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentPost'
 */
router.put("/:id", auth_middleware_1.default, student_post_controller_1.default.putById.bind(student_post_controller_1.default));
/**
 * @swagger
 * /studentPost/{id}:
 *   delete:
 *     summary: Deletes a student post
 *     tags: [StudentPost]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the student post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student post deleted successfully
 *       404:
 *         description: Student post not found
 */
router.delete("/:id", auth_middleware_1.default, student_post_controller_1.default.deleteById.bind(student_post_controller_1.default));
module.exports = router;
// router.get(
//   "/owner/:ownerId",
//   (StudentPostController as any).getStudentPostsByOwner.bind(
//     StudentPostController
//   )
// );
//# sourceMappingURL=student_post_routes.js.map