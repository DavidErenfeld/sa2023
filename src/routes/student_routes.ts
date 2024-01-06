import express from "express";
const router = express.Router();
import StudentController from "../controllers/student_controller";
import authMiddleware from "../common/auth_middleware";

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the student
 *         name:
 *           type: string
 *           description: The name of the student
 *       example:
 *         _id: "12345"
 *         name: "John Doe"
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
 * /student:
 *   get:
 *     summary: Retrieves a list of students
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */

router.get("/", authMiddleware, StudentController.get.bind(StudentController));

/**
 * @swagger
 * /student/{id}:
 *   get:
 *     summary: Retrieves a student by ID
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the student
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of a student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 */
router.get(
  "/:id",
  authMiddleware,
  StudentController.getById.bind(StudentController)
);

/**
 * @swagger
 * /student:
 *   post:
 *     summary: Creates a new student
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: New student created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       409:
 *         description: Duplicate key error
 */
router.post(
  "/",
  authMiddleware,
  StudentController.post.bind(StudentController)
);

/**
 * @swagger
 * /student/{id}:
 *   put:
 *     summary: Updates a student's details
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the student
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Student updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 */
router.put(
  "/:id",
  authMiddleware,
  StudentController.putById.bind(StudentController)
);

/**
 * @swagger
 * /student/{id}:
 *   delete:
 *     summary: Deletes a student
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the student
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 */
router.delete(
  "/:id",
  authMiddleware,
  StudentController.deleteById.bind(StudentController)
);

export = router;
