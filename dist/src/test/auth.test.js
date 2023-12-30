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
    test("registe test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send({
            email: "test",
            password: "test",
        });
        expect(response.status).toEqual(200);
    }));
    test("registe test duplicate", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send({
            email: "test",
            password: "test",
        });
        expect(response.status).toEqual(400);
    }));
    test("login test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send({
            email: "test",
            password: "test",
        });
        expect(response.status).toEqual(200);
    }));
    test("logeout test", () => __awaiter(void 0, void 0, void 0, function* () {
        // const response = await request(app).post("/auth/logout").send({
        //   email: "test",
        //   password: "test",
        // });
        // expect(response.status).toEqual(200);
    }));
});
//# sourceMappingURL=auth.test.js.map