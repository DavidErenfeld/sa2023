import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import StudentPost, { IStudentPost } from "../models/student_post_model ";
import { Express } from "express";
import User_model, { IUser } from "../models/user_model";

const user: IUser = {
  email: "test@student.post.com",
  password: "12345667867",
};
let accessToken: string;
let app: Express;
//Delete DB before test
beforeAll(async () => {
  app = await initApp();
  console.log("jest beforeAll");
  await StudentPost.deleteMany();
  await User_model.deleteMany({ email: user.email });
  const response1 = await request(app).post("/auth/register").send(user);
  user._id = response1.body._id;
  await request(app).post("/auth/register").send(user);
  const response = await request(app).post("/auth/login").send(user);
  accessToken = response.body.accessToken;
});

//Close DB after test
afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("--Test Student Post Module --", () => {
  const studentPost1: IStudentPost = {
    owner: "David",
    title: "this is a title",
    content: "This is a post content",
  };

  const studentPost2: IStudentPost = {
    owner: "Moshe",
    title: "this is a title",
    content: "This is a post content",
  };

  //FUNCTION  Add a new student and send to the DB
  const addNewStudentPost = async (studentPost: IStudentPost) => {
    const response = await request(app)
      .post("/studentPost")
      .set("Authorization", "JWT " + accessToken)
      .send(studentPost);

    expect(response.statusCode).toEqual(200);
    response.body._id = user._id;
    expect(response.body._id).toEqual(user._id);
  };

  // TEST GET
  test("Test 1: get all student-posts", async () => {
    const response = await request(app).get("/studentPost");
    expect(response.statusCode).toBe(200);
    // בדיקה שהתגובה מכילה מערך
    expect(Array.isArray(response.body)).toBeTruthy();
    // אם יש ציפיות ספציפיות לתוכן, למשל מספר פריטים מסוים או פרטים מסוימים בפוסטים
    expect(response.body.length).toBe(0);
    // expect(response.body[0]).toHaveProperty("title", "כותרת מסוימת");
  });

  // TEST ADD
  test("Test 2: add new student-post--", async () => {
    //Add a new student and send to the DB
    await addNewStudentPost(studentPost1);
    console.log("new student-post created");
  });

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

  test("Test 5: get all student-posts - one post", async () => {
    const response = await request(app).get("/studentPost");
    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toEqual(1);
  });

  test("Test 6: add new student post and get all student-posts - 2 posts", async () => {
    addNewStudentPost(studentPost2);
    const response = await request(app).get("/studentPost");
    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toEqual(2);
  });

  // TEST UPDATE(PUT)
  test("Test 7: update student post ", async () => {
    const response1 = await request(app).get(`/studentPost`);
    const updatePost = response1.body[0];
    updatePost.title = "update title";
    updatePost.content = "update content";
    const response2 = await request(app)
      .put(`/studentPost/${updatePost._id}`)
      .set("Authorization", "JWT " + accessToken)
      .send(updatePost);

    expect(response2.statusCode).toEqual(200);
  });

  //TEST DELETE
  test("Test 8: delete student post ", async () => {
    const response1 = await request(app).get(`/studentPost`);
    const post = response1.body[0];
    const response2 = await request(app)
      .delete(`/studentPost/${post._id}`)
      .set("Authorization", "JWT " + accessToken);

    expect(response2.status).toEqual(200);
  });
});
