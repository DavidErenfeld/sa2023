import mongoose from "mongoose";

export interface IStudentPost {
  owner: string;
  title: string;
  content: string;
}

const studentPostSchema = new mongoose.Schema<IStudentPost>({
  owner: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IStudentPost>("StudentsPost", studentPostSchema);
