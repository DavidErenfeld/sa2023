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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const student_post_model_1 = __importDefault(require("../models/student_post_model "));
const student_post_controller_1 = __importDefault(require("../controllers/student_post_controller"));
let app;
//Delete DB before test
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("jest beforeAll");
    yield student_post_model_1.default.deleteMany();
}));
//Close DB after test
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
describe("--Test Student Post Module --", () => {
    const studentPost1 = {
        owner: "David",
        title: "this is a title",
        content: "This is a post content",
    };
    const studentPost2 = {
        owner: "Moshe",
        title: "this is a title",
        content: "This is a post content",
    };
    const studentPost3 = {
        owner: "Chava",
        title: "this is a title",
        content: "This is a post content",
    };
    const studentPost4 = {
        owner: "Menucha",
        title: "this is a title",
        content: "This is a post content",
    };
    //FUNCTION  Add a new student and send to the DB
    const addNewStudentPost = (studentPost) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/studentPost").send(studentPost);
        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual("OK");
    });
    const stopConnection = function (String) {
        jest.spyOn(student_post_controller_1.default, String).mockImplementation(() => {
            throw new Error("Connection error");
        });
    };
    //TEST 1
    test("1 Test get all student-posts - empty collection", () => __awaiter(void 0, void 0, void 0, function* () {
        //Test if status cod == 200
        const response = yield (0, supertest_1.default)(app).get("/studentPost");
        expect(response.statusCode).toEqual(200);
        //Test if the collection is empty
        const data = response.body;
        expect(data.length).toEqual(0);
        console.log("the collection is empty");
    }));
    //TEST2
    test("2 Test add new student-post--", () => __awaiter(void 0, void 0, void 0, function* () {
        //Add a new student and send to the DB
        addNewStudentPost(studentPost1);
        console.log("new student-post addt");
    }));
    //TEST 3
    test("3 Test add new student-post fail--> duplicate id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/studentPost").send(studentPost1);
        expect(response.statusCode).toEqual(500);
        console.log("new student-post faild");
    }));
    //TEST 4
    test("4 test get student by owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/studentPost?owner=${studentPost1.owner}`);
        expect(response.statusCode).toEqual(200);
        const st = response.body[0];
        expect(st.owner).toEqual(studentPost1.owner);
    }));
    //TEST 6
    test("6 test get student by owner fail --owner is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/student?owner=${studentPost1.owner}a`);
        expect(response.statusCode).toEqual(404);
    }));
    //TEST 7
    test("7 Test get all student-posts - one student", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/studentPost");
        expect(response.statusCode).toEqual(200);
        const data = response.body;
        expect(data.length).toEqual(1);
        const st = response.body[0];
        expect(st.owner).toEqual(studentPost1.owner);
        expect(st.title).toEqual(studentPost1.title);
        expect(st.content).toEqual(studentPost1.content);
    }));
    //TEST 8
    test("8 Test get all student-posts (one student) - connection err", () => __awaiter(void 0, void 0, void 0, function* () {
        // מדמה שגיאת חיבור בזמן הפעלת Student.findById()
        stopConnection("find");
        const response = yield (0, supertest_1.default)(app).get(`/student`);
        // משחזר את ההתנהגות המקורית של Student.findById()
        jest.restoreAllMocks();
        expect(response.statusCode).toEqual(500);
    }));
    //TEST 9.1
    // test("9.1 Test get student by ID - success", async () => {
    //   // Retrieve the added student by ID
    //   const response = await request(app).get(`/student/${student1._id}`);
    //   expect(response.statusCode).toEqual(200);
    //   const st = response.body;
    //   expect(st.name).toEqual(student1.name);
    //   expect(st._id).toEqual(student1._id);
    // });
    //TEST 9.2
    // test("9.2 Test get student by ID - connection err", async () => {
    //   // מדמה שגיאת חיבור בזמן הפעלת Student.findById()
    //   stopConnection("findById");
    //   const response = await request(app).get(`/student/${student1._id}`);
    //   // משחזר את ההתנהגות המקורית של Student.findById()
    //   jest.restoreAllMocks();
    //   expect(response.statusCode).toEqual(500);
    // });
    //TEST 10
    // test("10 Test get student by ID - fail", async () => {
    //   jest.restoreAllMocks();
    //   // Retrieve the added student by ID
    //   const response = await request(app).get(`/student/444444444`);
    //   expect(response.statusCode).toEqual(404);
    // });
    //TEST 11
    test("11 Test add new student--", () => __awaiter(void 0, void 0, void 0, function* () {
        addNewStudentPost(studentPost2);
    }));
    //TEST 12
    // test("12 Test get all students - 2 students", async () => {
    //   const response = await request(app).get("/student");
    //   expect(response.statusCode).toEqual(200);
    //   const data = response.body;
    //   expect(data.length).toEqual(2);
    //   const st = response.body[0];
    //   if (st._id === student1._id) {
    //     expect(st.name).toEqual(student1.name);
    //   } else {
    //     expect(st.name).toEqual(student2.name);
    //     expect(st._id).toEqual(student2._id);
    //   }
    // });
    //TEST 13
    // test("13 put student by ID", async () => {
    //   const response = await request(app)
    //     .put(`/student/${student3._id}`)
    //     .send(student3);
    //   expect(response.statusCode).toBe(200);
    //   const st = response.body;
    //   expect(st.name).toEqual(student3.name);
    //   expect(st._id).toEqual(student3._id);
    // });
    //TEST 14.1
    // test("14.1 put student by ID file-- ID not found", async () => {
    //   const response = await request(app)
    //     .put(`/student/${student3._id}1`)
    //     .send(student3);
    //   expect(response.statusCode).toBe(404);
    // });
    //TEST 14.2
    // test("14.2 put student by ID fail - connection error", async () => {
    //   stopConnection("findByIdAndUpdate");
    //   const response = await request(app)
    //     .put(`/student/${student4._id}`)
    //     .send(student4);
    //   // משחזר את ההתנהגות המקורית של Student.findByIdAndUpdate()
    //   jest.restoreAllMocks();
    //   expect(response.statusCode).toEqual(500);
    // });
    //TEST 15
    // test("15 delete student by ID", async () => {
    //   const response = await request(app).delete(`/student/${student2._id}`);
    //   expect(response.statusCode).toBe(200);
    // });
    //TEST 16
    // test("16 delete student by ID fail -- ID not found", async () => {
    //   const response = await request(app).delete(`/student/${student2._id}1`);
    //   expect(response.statusCode).toBe(404);
    // });
    //TEST 16.2
    // test("16.2 delete student by ID fail-- connection error", async () => {
    //   // מדמה שגיאת חיבור בזמן הפעלת Student.findOneAndDelete()
    //   stopConnection("findOneAndDelete");
    //   const response = await request(app).delete(`/student/${student1._id}`);
    //   //Connectiong back
    //   jest.restoreAllMocks();
    //   expect(response.statusCode).toBe(500);
    // });
    //TEST 17
    // test("17 Test get all students - one student", async () => {
    //   const response = await request(app).get("/student");
    //   expect(response.statusCode).toEqual(200);
    //   const data = response.body;
    //   expect(data.length).toEqual(1);
    //   const st = response.body[0];
    //   console.log(st.name, st.id);
    //   expect(st.name).toEqual(student3.name);
    //   expect(st._id).toEqual(student1._id);
    // });
});
//# sourceMappingURL=student_post.test%20.js.map