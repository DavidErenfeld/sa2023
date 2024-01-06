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
const user_model_1 = __importDefault(require("../models/user_model"));
let app;
const user = {
    email: "test@auth.com",
    password: "1238765423",
};
const user1 = {
    email: "test1@auth.com",
    password: "1238765423",
};
let accessToken;
let refreshToken;
let newRefreshToken;
let accessToken1;
let refreshToken1;
//Delete DB before test
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("jest beforeAll");
    yield user_model_1.default.deleteMany();
}));
//Close DB after test
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
describe("--Auth Tests--", () => {
    test("Test Register", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send(user);
        expect(response.statusCode).toBe(200);
    }));
    test("Test Register exist email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send(user);
        expect(response.statusCode).toBe(400);
    }));
    test("Test Register missing password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send({
            email: "test@test.com",
        });
        expect(response.statusCode).toBe(400);
    }));
    test("Test Login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
        expect(response.statusCode).toBe(200);
        accessToken = response.body.accessToken;
        refreshToken = response.body.refreshToken;
        expect(accessToken).toBeDefined();
    }));
    test("Test forbidden access without token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/student");
        expect(response.statusCode).toBe(401);
    }));
    test("Test access with valid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/student")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
    }));
    test("Test access with invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/student")
            .set("Authorization", "JWT 1" + accessToken);
        expect(response.statusCode).toBe(401);
    }));
    test("Test refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/auth/refresh")
            .set("Authorization", "JWT " + refreshToken)
            .send();
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        const newAccessToken = response.body.accessToken;
        newRefreshToken = response.body.refreshToken;
        const response2 = yield (0, supertest_1.default)(app)
            .get("/student")
            .set("Authorization", "JWT " + newAccessToken);
        expect(response2.statusCode).toBe(200);
    }));
    test("logeout test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response1 = yield (0, supertest_1.default)(app)
            .get("/auth/logout")
            .set("Authorization", "JWT " + refreshToken)
            .send();
        expect(response1.status).toEqual(200);
        const response2 = yield (0, supertest_1.default)(app)
            .get("/auth/refresh")
            .set("Authorization", "JWT " + refreshToken)
            .send();
        expect(response2.status).not.toEqual(200);
    }));
    test("Test Register 2", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send(user1);
        expect(response.statusCode).toBe(200);
    }));
    test("Test Login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user1);
        expect(response.statusCode).toBe(200);
        accessToken1 = response.body.accessToken;
        refreshToken = response.body.refreshToken;
        expect(accessToken1).toBeDefined();
    }));
    test("Test access after timeout of token", () => __awaiter(void 0, void 0, void 0, function* () {
        jest.setTimeout(10000);
        yield new Promise((resolve) => setTimeout(() => resolve("done"), 4000));
        const response = yield (0, supertest_1.default)(app)
            .get("/student")
            .set("Authorization", "JWT " + accessToken1);
        expect(response.statusCode).not.toBe(200);
    }));
    test("Test double use of refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/auth/refresh")
            .set("Authorization", "JWT " + refreshToken)
            .send();
        expect(response.statusCode).toEqual(200);
        //verify that the new token is not valid as well
        const response1 = yield (0, supertest_1.default)(app)
            .get("/auth/refresh")
            .set("Authorization", "JWT " + refreshToken)
            .send();
        expect(response1.statusCode).not.toEqual(200);
    }));
});
//# sourceMappingURL=auth.test.js.map