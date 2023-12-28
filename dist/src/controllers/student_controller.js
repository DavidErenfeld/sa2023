"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const student_model_1 = __importDefault(require("../models/student_model"));
const base_controller_1 = __importDefault(require("./base_controller"));
const StudentController = (0, base_controller_1.default)(student_model_1.default);
module.exports = StudentController;
//# sourceMappingURL=student_controller.js.map