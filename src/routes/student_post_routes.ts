import express from "express";
const router = express.Router();
import StudentPostController from "../controllers/student_post_controller";
import authMiddleWare from "../common/auth_middleware";

router.get("/", StudentPostController.get.bind(StudentPostController));

// router.get(
//   "/owner/:ownerId",
//   (StudentPostController as any).getStudentPostsByOwner.bind(
//     StudentPostController
//   )
// );

router.get("/:id", StudentPostController.getById.bind(StudentPostController));

router.post(
  "/",
  authMiddleWare,
  StudentPostController.post.bind(StudentPostController)
);

router.put(
  "/:id",
  authMiddleWare,
  StudentPostController.putById.bind(StudentPostController)
);

router.delete(
  "/:id",
  authMiddleWare,
  StudentPostController.deleteById.bind(StudentPostController)
);

export = router;
