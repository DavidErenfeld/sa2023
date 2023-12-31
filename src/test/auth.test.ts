import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import UserModel from "../models/user_model";
import { Express } from "express";

let app: Express;
//Delete DB before test
beforeAll(async () => {
  app = await initApp();
  console.log("jest beforeAll");
  await UserModel.deleteMany();
});

//Close DB after test
afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("--Auth Tests--", () => {
  test("registe test", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "test",
      password: "test",
    });
    expect(response.status).toEqual(200);
  });

  test("registe test duplicate", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "test",
      password: "test",
    });
    expect(response.status).toEqual(400);
  });

  test("login test", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "test",
      password: "test",
    });
    expect(response.status).toEqual(200);

    const token = response.body.accessToken;
    expect(token).not.toBeNull();
    const response2 = await request(app)
      .get("/student")
      .set("Authorization", "JWT " + token);
    expect(response2.status).toEqual(200);

    const response3 = await request(app)
      .get("/student")
      .set("Authorization", "JWT 1" + token);
    expect(response3.status).toEqual(401);
  });
  test("logeout test", async () => {
    // const response = await request(app).post("/auth/logout").send({
    //   email: "test",
    //   password: "test",
    // });
    // expect(response.status).toEqual(200);
  });
});
