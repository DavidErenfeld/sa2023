"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class BaseController {
    constructor(model) {
        this.model = model;
    }
    // Post
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("postStudent:" + req.body);
            try {
                yield this.model.create(req.body);
                res.status(200).send("OK");
            }
            catch (err) {
                if (err.code === 11000) {
                    // שגיאת מפתח כפול
                    res.status(409).json({ message: "Duplicate key error" });
                }
                else {
                    console.log(err);
                    res.status(500).json({ message: err.message });
                }
            }
        });
    }
    // Get
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getAllStudents");
            let students;
            try {
                if (req.query.name) {
                    students = yield this.model.find({ name: req.query.name });
                    if (students.length === 0) {
                        return res
                            .status(404)
                            .json({ message: `${req.query.name} is not found` });
                    }
                }
                else {
                    students = yield this.model.find();
                }
                res.send(students);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    // Get by ID
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getStudentById: " + req.params.id);
            try {
                if (req.params.id) {
                    // בדיקה אם ה-ID תקין
                    const student = yield this.model.findById(req.params.id);
                    if (student) {
                        res.send(student);
                    }
                    else {
                        return res.status(404).json({ message: "Student ID not found" });
                    }
                }
            }
            catch (err) {
                res.status(500).json({ message: err.message }); // שגיאה פנימית בשרת
            }
        });
    }
    // Put by ID
    putById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("putStudentById: " + req.params.id);
            const studentId = req.params.id;
            try {
                const updateStudent = yield this.model.findByIdAndUpdate(studentId, req.body, {
                    new: true,
                });
                if (!updateStudent) {
                    return res
                        .status(404)
                        .json({ message: `id: ${studentId} is not found!` });
                }
                res.send(updateStudent);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    // Delete by ID
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("deleteStudentById: " + req.params.id);
            try {
                const deleteStudent = yield this.model.findOneAndDelete({
                    _id: req.params.id,
                });
                if (!deleteStudent) {
                    return res
                        .status(404)
                        .json({ message: `id: ${req.params.id} is not found` });
                }
                res.send(`student ${req.params.id} deleted!`);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
}
const createController = (model) => new BaseController(model);
module.exports = createController;
//# sourceMappingURL=base_controller.js.map