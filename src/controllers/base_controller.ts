import { Request, Response } from "express";
import { Model } from "mongoose";
import { AuthRequest } from "../common/auth_middleware";

export class BaseController<ObjectInterface> {
  model: Model<ObjectInterface>;
  constructor(model: Model<ObjectInterface>) {
    this.model = model;
  }

  // Post
  async post(req: AuthRequest, res: Response) {
    console.log("postStudent:" + req.body);

    try {
      const obj = await this.model.create(req.body);
      res.status(200).send(obj);
    } catch (err) {
      if (err.code === 11000) {
        // שגיאת מפתח כפול
        res.status(409).json({ message: "Duplicate key error" });
      } else {
        console.log(err);
        res.status(500).json({ message: err.message });
      }
    }
  }

  // Get
  async get(req: Request, res: Response) {
    console.log("getAllStudents");
    let students: any;
    try {
      if (req.query.name) {
        students = await this.model.find({ name: req.query.name });
        if (students.length === 0) {
          return res
            .status(404)
            .json({ message: `${req.query.name} is not found` });
        }
      } else {
        students = await this.model.find();
      }
      res.send(students);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Get by ID
  async getById(req: Request, res: Response) {
    console.log("getStudentById: " + req.params.id);

    try {
      if (req.params.id) {
        // בדיקה אם ה-ID תקין
        const student = await this.model.findById(req.params.id);
        if (student) {
          res.send(student);
        } else {
          return res.status(404).json({ message: "Student ID not found" });
        }
      }
    } catch (err) {
      res.status(500).json({ message: err.message }); // שגיאה פנימית בשרת
    }
  }

  // Put by ID

  // async putById(req: Request, res: Response) {
  //   console.log("putStudent:" + req.body);
  //   try {
  //     await this.model.findByIdAndUpdate(req.params.id, req.body);
  //     const obj = await this.model.findById(req.params.id);
  //     res.status(200).send(obj);
  //   } catch (err) {
  //     console.log(err);
  //     res.status(406).send("fail: " + err.message);
  //   }
  // }
  async putById(req: Request, res: Response) {
    console.log("putStudentById: " + req.params._id);

    const studentId = req.params.id;

    try {
      const updateStudent = await this.model.findByIdAndUpdate(
        studentId,
        req.body,
        {
          new: true,
        }
      );
      res.send(updateStudent);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Delete by ID
  async deleteById(req: Request, res: Response) {
    console.log("deleteStudentById: " + req.params.id);
    try {
      const deleteStudent = await this.model.findOneAndDelete({
        _id: req.params.id,
      });
      if (!deleteStudent) {
        return res
          .status(404)
          .json({ message: `id: ${req.params.id} is not found` });
      }
      res.send(`student ${req.params.id} deleted!`);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}
const createController = <ObjectInterface>(model: Model<ObjectInterface>) =>
  new BaseController<ObjectInterface>(model);

export default createController;
