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
const user_model_1 = __importDefault(require("../models/user_model"));
const user = {
    email: "test@student.post.com",
    password: "12345667867",
};
let accessToken;
let app;
//Delete DB before test
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("jest beforeAll");
    yield student_post_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ email: user.email });
    const response1 = yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    user._id = response1.body._id;
    yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
    accessToken = response.body.accessToken;
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
    //FUNCTION  Add a new student and send to the DB
    const addNewStudentPost = (studentPost) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/studentPost")
            .set("Authorization", "JWT " + accessToken)
            .send(studentPost);
        expect(response.statusCode).toEqual(200);
        response.body._id = user._id;
        expect(response.body._id).toEqual(user._id);
    });
    // TEST GET
    test("Test 1: get all student-posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/studentPost");
        expect(response.statusCode).toBe(200);
        // בדיקה שהתגובה מכילה מערך
        expect(Array.isArray(response.body)).toBeTruthy();
        // אם יש ציפיות ספציפיות לתוכן, למשל מספר פריטים מסוים או פרטים מסוימים בפוסטים
        expect(response.body.length).toBe(0);
        // expect(response.body[0]).toHaveProperty("title", "כותרת מסוימת");
    }));
    // TEST ADD
    test("Test 2: add new student-post--", () => __awaiter(void 0, void 0, void 0, function* () {
        //Add a new student and send to the DB
        yield addNewStudentPost(studentPost1);
        console.log("new student-post created");
    }));
    // TEST GET STUDENT BY OWNER
    // test("3 Test get student by owner", async () => {
    //   const response = await request(app).get(
    //     `/studentPost?owner=${studentPost1.owner}`
    //   );
    //   expect(response.statusCode).toEqual(200);
    //   const st = response.body[0];
    //   expect(st.owner).toEqual(studentPost1.owner);
    // });
    // // TEST GET STUDENT BY OWNER -- FAIL
    // test("4 Test get student-post by owner fail --owner is not found", async () => {
    //   const response = await request(app).get(
    //     `/studentPost/owner/${studentPost1.owner}a`
    //   );
    //   console.log(response.body);
    //   expect(response.statusCode).toEqual(404);
    // });
    test("Test 5: get all student-posts - one post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/studentPost");
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toEqual(1);
    }));
    test("Test 6: add new student post and get all student-posts - 2 posts", () => __awaiter(void 0, void 0, void 0, function* () {
        addNewStudentPost(studentPost2);
        const response = yield (0, supertest_1.default)(app).get("/studentPost");
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toEqual(2);
    }));
    // TEST UPDATE(PUT)
    test("Test 7: update student post ", () => __awaiter(void 0, void 0, void 0, function* () {
        const response1 = yield (0, supertest_1.default)(app).get(`/studentPost`);
        const updatePost = response1.body[0];
        updatePost.title = "update title";
        updatePost.content = "update content";
        const response2 = yield (0, supertest_1.default)(app)
            .put(`/studentPost/${updatePost._id}`)
            .set("Authorization", "JWT " + accessToken)
            .send(updatePost);
        expect(response2.statusCode).toEqual(200);
    }));
    //TEST DELETE
    test("Test 8: delete student post ", () => __awaiter(void 0, void 0, void 0, function* () {
        const response1 = yield (0, supertest_1.default)(app).get(`/studentPost`);
        const post = response1.body[0];
        const response2 = yield (0, supertest_1.default)(app)
            .delete(`/studentPost/${post._id}`)
            .set("Authorization", "JWT " + accessToken);
        expect(response2.status).toEqual(200);
    }));
});
//# sourceMappingURL=student_post.test.js.map