import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import UserModel, { IUser } from "../models/user_model";
import { Express } from "express";

let app: Express;

const user = {
  email: "test@auth.com",
  password: "1238765423",
};

const user1 = {
  email: "test1@auth.com",
  password: "1238765423",
};

let accessToken: string;
let refreshToken: string;
let newRefreshToken: string;

let accessToken1: string;
let refreshToken1: string;
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
  test("Test Register", async () => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(200);
  });

  test("Test Register exist email", async () => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(400);
  });

  test("Test Register missing password", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "test@test.com",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Test Login", async () => {
    const response = await request(app).post("/auth/login").send(user);
    expect(response.statusCode).toBe(200);
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
    expect(accessToken).toBeDefined();
  });

  test("Test forbidden access without token", async () => {
    const response = await request(app).get("/student");
    expect(response.statusCode).toBe(401);
  });

  test("Test access with valid token", async () => {
    const response = await request(app)
      .get("/student")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
  });

  test("Test access with invalid token", async () => {
    const response = await request(app)
      .get("/student")
      .set("Authorization", "JWT 1" + accessToken);
    expect(response.statusCode).toBe(401);
  });

  test("Test refresh token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + refreshToken)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();

    const newAccessToken = response.body.accessToken;
    newRefreshToken = response.body.refreshToken;

    const response2 = await request(app)
      .get("/student")
      .set("Authorization", "JWT " + newAccessToken);
    expect(response2.statusCode).toBe(200);
  });

  test("logeout test", async () => {
    const response1 = await request(app)
      .get("/auth/logout")
      .set("Authorization", "JWT " + refreshToken)
      .send();
    // console.log(
    //   `==========############$$$$$$$$$$$$${response1.body.refreshToken}==========############$$$$$$$$$$$$`
    // );
    expect(response1.status).toEqual(200);

    const response2 = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + refreshToken)
      .send();
    expect(response2.status).not.toEqual(200);
  });
  /////////////////////////////////////////////////////

  test("Test Register", async () => {
    const response = await request(app).post("/auth/register").send(user1);
    expect(response.statusCode).toBe(200);
  });

  test("Test Login", async () => {
    const response = await request(app).post("/auth/login").send(user1);
    expect(response.statusCode).toBe(200);
    accessToken1 = response.body.accessToken;
    refreshToken = response.body.refreshToken;
    expect(accessToken1).toBeDefined();
  });

  test("Test access after timeout of token", async () => {
    jest.setTimeout(10000);
    await new Promise((resolve) => setTimeout(() => resolve("done"), 4000));

    const response = await request(app)
      .get("/student")
      .set("Authorization", "JWT " + accessToken1);
    expect(response.statusCode).not.toBe(200);
  });

  test("Test double use of refresh token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + refreshToken)
      .send();
    expect(response.statusCode).toEqual(200);

    //verify that the new token is not valid as well
    const response1 = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + refreshToken)
      .send();
    expect(response1.statusCode).not.toEqual(200);
  });
});

// test("Successful register", async () => {
//   const response = await request(app).post("/auth/register").send(user);
//   expect(response.status).toBe(200);
// });

// // טסט להרשמה עם אימייל קיים
// test("Register with existing email", async () => {
//   const response = await request(app).post("/auth/register").send(user);
//   expect(response.status).toBe(400);
// });

// // טסט לכניסה
// test("Successful login", async () => {
//   const response = await request(app).post("/auth/login").send(user);
//   expect(response.status).toBe(200);
//   accessToken = response.body.accessToken;
//   refreshToken = response.body.refreshToken;
// });

// // טסט לכניסה עם סיסמה שגויה
// test("Login with wrong password", async () => {
//   const response = await request(app).post("/auth/login").send(user);
//   expect(response.status).toBe(400);
// });

// // טסט לרענון טוקן
// test("Successful token refresh", async () => {
//   const response = await request(app)
//     .get("/auth/refresh")
//     .set("Authorization", `JWT ${refreshToken}`);
//   expect(response.status).toBe(200);
//   newRefreshToken = response.body.refreshToken;
// });

// // טסט להתנתקות
// test("Successful logout", async () => {
//   const response = await request(app)
//     .get("/auth/logout")
//     .set("Authorization", `JWT ${newRefreshToken}`);
//   expect(response.status).toBe(200);
// });
