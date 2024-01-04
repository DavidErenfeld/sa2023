import StudentPost, { IStudentPost } from "../models/student_post_model ";
import { BaseController } from "./base_controller";
import { Model } from "mongoose";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";

// יצירת הקונטרולר הבסיסי
class StudentPostController extends BaseController<IStudentPost> {
  constructor(model: Model<IStudentPost>) {
    super(model);
  }

  async post(req: AuthRequest, res: Response) {
    const userId = req.user._id;
    const message = req.body;
    message.owner = userId;

    super.post(req, res);
  }

  async putById(req: AuthRequest, res: Response) {
    const userId = req.user._id;
    const message = req.body;
    message.owner = userId;

    super.putById(req, res);
  }
}

export default new StudentPostController(StudentPost);

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
