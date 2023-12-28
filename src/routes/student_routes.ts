import express from "express";
const router = express.Router();
import StudentController from "../controllers/student_controller";

router.get("/", StudentController.get.bind(StudentController));

router.get("/", StudentController.get.bind(StudentController));

router.get("/:id", StudentController.getById.bind(StudentController));

router.post("/", StudentController.post.bind(StudentController));

router.put("/:id", StudentController.putById.bind(StudentController));

router.delete("/:id", StudentController.deleteById.bind(StudentController));

export = router;
