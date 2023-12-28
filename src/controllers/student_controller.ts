import Student, { IStudent } from "../models/student_model";
import createController from "./base_controller";

const StudentController = createController<IStudent>(Student);

export = StudentController;
