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
const student_model_1 = __importDefault(require("../models/student_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
let app;
let token;
const user = {
    email: "test@student.com",
    password: "123567890",
};
//Delete DB before test
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("jest beforeAll");
    yield student_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ email: user.email });
    yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
    token = response.body.accessToken;
}));
//Close DB after test
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
describe("--Test Student Module --", () => {
    const student1 = {
        name: "John Doe",
        _id: "123456",
    };
    const student2 = {
        name: "John Doe 2",
        _id: "1234567",
    };
    const student3 = {
        name: "David",
        _id: "123456",
    };
    const student4 = {
        name: "Moshe",
        _id: "1234567",
    };
    //FUNCTION  Add a new student and send to the DB
    const addNewStudent = (student) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/student")
            .send(student)
            .set("Authorization", "JWT " + token);
        expect(response.statusCode).toEqual(200);
        // expect(response.text).toEqual("OK");
    });
    const stopConnection = function (String) {
        jest.spyOn(student_model_1.default, String).mockImplementation(() => {
            throw new Error("Connection error");
        });
    };
    //TEST 1
    test("1 Test get all students - empty collection", () => __awaiter(void 0, void 0, void 0, function* () {
        //Test if status cod == 200
        const response = yield (0, supertest_1.default)(app)
            .get("/student")
            .set("Authorization", "JWT " + token);
        expect(response.statusCode).toEqual(200);
        //Test if the collection is empty
        const data = response.body;
        expect(data.length).toEqual(0);
    }));
    //TEST2
    test("2 Test add new student--", () => __awaiter(void 0, void 0, void 0, function* () {
        //Add a new student and send to the DB
        addNewStudent(student1);
    }));
    // TEST 3
    test("3 Test add new student fail--> duplicate id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/student")
            .send(student1)
            .set("Authorization", "JWT " + token);
        expect(response.statusCode).toEqual(409);
    }));
    //TEST 4
    test("4 test get student by name", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/student?name=${student1.name}`)
            .set("Authorization", "JWT " + token);
        expect(response.statusCode).toEqual(200);
        const st = response.body[0];
        expect(st.name).toEqual(student1.name);
    }));
    //TEST 6
    test("6 test get student by name fail --name is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/student?name=${student1.name}a`)
            .set("Authorization", "JWT " + token);
        expect(response.statusCode).toEqual(404);
    }));
    //TEST 7
    test("7 Test get all students - one student", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/student")
            .set("Authorization", "JWT " + token);
        expect(response.statusCode).toEqual(200);
        const data = response.body;
        expect(data.length).toEqual(1);
        const st = response.body[0];
        expect(st.name).toEqual(student1.name);
        expect(st._id).toEqual(student1._id);
    }));
    //TEST 8
    test("8 Test get all students (one student) - connection err", () => __awaiter(void 0, void 0, void 0, function* () {
        // מדמה שגיאת חיבור בזמן הפעלת Student.findById()
        stopConnection("find");
        const response = yield (0, supertest_1.default)(app)
            .get(`/student`)
            .set("Authorization", "JWT " + token);
        // משחזר את ההתנהגות המקורית של Student.findById()
        jest.restoreAllMocks();
        expect(response.statusCode).toEqual(500);
    }));
    //TEST 9.1
    test("9.1 Test get student by ID - success", () => __awaiter(void 0, void 0, void 0, function* () {
        // Retrieve the added student by ID
        const response = yield (0, supertest_1.default)(app)
            .get(`/student/${student1._id}`)
            .set("Authorization", "JWT " + token);
        expect(response.statusCode).toEqual(200);
        const st = response.body;
        expect(st.name).toEqual(student1.name);
        expect(st._id).toEqual(student1._id);
    }));
    //TEST 9.2
    test("9.2 Test get student by ID - connection err", () => __awaiter(void 0, void 0, void 0, function* () {
        // מדמה שגיאת חיבור בזמן הפעלת Student.findById()
        stopConnection("findById");
        const response = yield (0, supertest_1.default)(app)
            .get(`/student/${student1._id}`)
            .set("Authorization", "JWT " + token);
        // משחזר את ההתנהגות המקורית של Student.findById()
        jest.restoreAllMocks();
        expect(response.statusCode).toEqual(500);
    }));
    //TEST 10
    test("10 Test get student by ID - fail", () => __awaiter(void 0, void 0, void 0, function* () {
        jest.restoreAllMocks();
        // Retrieve the added student by ID
        const response = yield (0, supertest_1.default)(app)
            .get(`/student/444444444`)
            .set("Authorization", "JWT " + token);
        expect(response.statusCode).toEqual(404);
    }));
    //TEST 11
    test("11 Test add new student--", () => __awaiter(void 0, void 0, void 0, function* () {
        addNewStudent(student2);
    }));
    //TEST 12
    test("12 Test get all students - 2 students", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/student")
            .set("Authorization", "JWT " + token);
        expect(response.statusCode).toEqual(200);
        const data = response.body;
        expect(data.length).toEqual(2);
        const st = response.body[0];
        if (st._id === student1._id) {
            expect(st.name).toEqual(student1.name);
        }
        else {
            expect(st.name).toEqual(student2.name);
            expect(st._id).toEqual(student2._id);
        }
    }));
    //TEST 13
    test("13 put student by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/student/${student1._id}`)
            .send(student3)
            .set("Authorization", "JWT " + token);
        expect(response.statusCode).toBe(200);
        const st = response.body;
        expect(st.name).toEqual(student3.name);
        expect(st._id).toEqual(student3._id);
    }));
    //TEST 14.1
    // test("14.1 put student by ID file-- ID not found", async () => {
    //   const response = await request(app)
    //     .put(`/student/${student3._id}1`)
    //     .send(student3)
    //     .set("Authorization", "JWT " + token);
    //   expect(response.statusCode).toBe(404);
    // });
    //TEST 14.2
    test("14.2 put student by ID fail - connection error", () => __awaiter(void 0, void 0, void 0, function* () {
        stopConnection("findByIdAndUpdate");
        const response = yield (0, supertest_1.default)(app)
            .put(`/student/${student4._id}`)
            .send(student4)
            .set("Authorization", "JWT " + token);
        // משחזר את ההתנהגות המקורית של Student.findByIdAndUpdate()
        jest.restoreAllMocks();
        expect(response.statusCode).toEqual(500);
    }));
    //TEST 15
    test("15 delete student by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/student/${student2._id}`)
            .set("Authorization", "JWT " + token);
        expect(response.statusCode).toBe(200);
    }));
    //TEST 16
    test("16 delete student by ID fail -- ID not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/student/${student2._id}1`)
            .set("Authorization", "JWT " + token);
        expect(response.statusCode).toBe(404);
    }));
    //TEST 16.2
    test("16.2 delete student by ID fail-- connection error", () => __awaiter(void 0, void 0, void 0, function* () {
        // מדמה שגיאת חיבור בזמן הפעלת Student.findOneAndDelete()
        stopConnection("findOneAndDelete");
        const response = yield (0, supertest_1.default)(app)
            .delete(`/student/${student1._id}`)
            .set("Authorization", "JWT " + token);
        //Connectiong back
        jest.restoreAllMocks();
        expect(response.statusCode).toBe(500);
    }));
    //TEST 17
    test("17 Test get all students - one student", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/student")
            .set("Authorization", "JWT " + token);
        expect(response.statusCode).toEqual(200);
        const data = response.body;
        expect(data.length).toEqual(1);
        const st = response.body[0];
        expect(st.name).toEqual(student3.name);
        expect(st._id).toEqual(student3._id);
    }));
});
//# sourceMappingURL=student.test.js.map