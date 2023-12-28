import StudentPost, { IStudentPost } from "../models/student_post_model ";
import createController from "./base_controller";
import { Request, Response } from "express";

// יצירת הקונטרולר הבסיסי
const StudentPostController = createController<IStudentPost>(StudentPost);

// הוספת פונקציונליות חדשה לקונטרולר
(StudentPostController as any).getStudentPostsByOwner = async (
  req: Request,
  res: Response
) => {
  try {
    const posts = await StudentPost.find({ owner: req.params.ownerId });
    if (posts.length === 0) {
      return res
        .status(404)
        .json({ message: `${req.params.owner} is not found` });
    }
    // console.log(...posts);
    res.send(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export = StudentPostController;
