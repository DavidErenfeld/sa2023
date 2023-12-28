import express from "express";
const router = express.Router();
import StudentPostController from "../controllers/student_post_controller";

router.get("/", StudentPostController.get.bind(StudentPostController));

router.get(
  "/owner/:ownerId",
  (StudentPostController as any).getStudentPostsByOwner.bind(
    StudentPostController
  )
);

router.get("/:id", StudentPostController.getById.bind(StudentPostController));

router.post("/", StudentPostController.post.bind(StudentPostController));

router.put("/:id", StudentPostController.putById.bind(StudentPostController));

router.delete(
  "/:id",
  StudentPostController.deleteById.bind(StudentPostController)
);

export = router;
