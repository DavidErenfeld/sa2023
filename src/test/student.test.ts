import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import Student from "../models/student_model";
import StudentPost from "../models/student_post_model ";
import { Express } from "express";

let app: Express;
//Delete DB before test
beforeAll(async () => {
  app = await initApp();
  console.log("jest beforeAll");
  await Student.deleteMany();
});

//Close DB after test
afterAll((done) => {
  mongoose.connection.close();
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
  const addNewStudent = async (student: any) => {
    const response = await request(app).post("/student").send(student);

    expect(response.statusCode).toEqual(200);
    expect(response.text).toEqual("OK");
  };

  const stopConnection = function (String) {
    jest.spyOn(Student, String).mockImplementation(() => {
      throw new Error("Connection error");
    });
  };

  //TEST 1
  test("1 Test get all students - empty collection", async () => {
    //Test if status cod == 200
    const response = await request(app).get("/student");
    expect(response.statusCode).toEqual(200);

    //Test if the collection is empty
    const data = response.body;
    expect(data.length).toEqual(0);
  });

  //TEST2
  test("2 Test add new student--", async () => {
    //Add a new student and send to the DB
    addNewStudent(student1);
  });

  // TEST 3
  test("3 Test add new student fail--> duplicate id", async () => {
    const response = await request(app).post("/student").send(student1);
    expect(response.statusCode).toEqual(409);
  });

  //TEST 4
  test("4 test get student by name", async () => {
    const response = await request(app).get(`/student?name=${student1.name}`);
    expect(response.statusCode).toEqual(200);
    const st = response.body[0];
    expect(st.name).toEqual(student1.name);
  });

  //TEST 6
  test("6 test get student by name fail --name is not found", async () => {
    const response = await request(app).get(`/student?name=${student1.name}a`);
    expect(response.statusCode).toEqual(404);
  });

  //TEST 7
  test("7 Test get all students - one student", async () => {
    const response = await request(app).get("/student");
    expect(response.statusCode).toEqual(200);

    const data = response.body;
    expect(data.length).toEqual(1);

    const st = response.body[0];

    expect(st.name).toEqual(student1.name);
    expect(st._id).toEqual(student1._id);
  });

  //TEST 8
  test("8 Test get all students (one student) - connection err", async () => {
    // מדמה שגיאת חיבור בזמן הפעלת Student.findById()
    stopConnection("find");

    const response = await request(app).get(`/student`);

    // משחזר את ההתנהגות המקורית של Student.findById()
    jest.restoreAllMocks();

    expect(response.statusCode).toEqual(500);
  });

  //TEST 9.1
  test("9.1 Test get student by ID - success", async () => {
    // Retrieve the added student by ID
    const response = await request(app).get(`/student/${student1._id}`);
    expect(response.statusCode).toEqual(200);

    const st = response.body;
    expect(st.name).toEqual(student1.name);
    expect(st._id).toEqual(student1._id);
  });

  //TEST 9.2
  test("9.2 Test get student by ID - connection err", async () => {
    // מדמה שגיאת חיבור בזמן הפעלת Student.findById()
    stopConnection("findById");

    const response = await request(app).get(`/student/${student1._id}`);

    // משחזר את ההתנהגות המקורית של Student.findById()
    jest.restoreAllMocks();

    expect(response.statusCode).toEqual(500);
  });

  //TEST 10
  test("10 Test get student by ID - fail", async () => {
    jest.restoreAllMocks();
    // Retrieve the added student by ID
    const response = await request(app).get(`/student/444444444`);
    expect(response.statusCode).toEqual(404);
  });

  //TEST 11
  test("11 Test add new student--", async () => {
    addNewStudent(student2);
  });

  //TEST 12
  test("12 Test get all students - 2 students", async () => {
    const response = await request(app).get("/student");
    expect(response.statusCode).toEqual(200);

    const data = response.body;
    expect(data.length).toEqual(2);

    const st = response.body[0];

    if (st._id === student1._id) {
      expect(st.name).toEqual(student1.name);
    } else {
      expect(st.name).toEqual(student2.name);
      expect(st._id).toEqual(student2._id);
    }
  });

  //TEST 13
  test("13 put student by ID", async () => {
    const response = await request(app)
      .put(`/student/${student1._id}`)
      .send(student3);

    expect(response.statusCode).toBe(200);

    const st = response.body;

    expect(st.name).toEqual(student3.name);
    expect(st._id).toEqual(student3._id);
  });

  //TEST 14.1
  test("14.1 put student by ID file-- ID not found", async () => {
    const response = await request(app)
      .put(`/student/${student3._id}1`)
      .send(student3);

    expect(response.statusCode).toBe(404);
  });

  //TEST 14.2
  test("14.2 put student by ID fail - connection error", async () => {
    stopConnection("findByIdAndUpdate");

    const response = await request(app)
      .put(`/student/${student4._id}`)
      .send(student4);

    // משחזר את ההתנהגות המקורית של Student.findByIdAndUpdate()
    jest.restoreAllMocks();

    expect(response.statusCode).toEqual(500);
  });

  //TEST 15
  test("15 delete student by ID", async () => {
    const response = await request(app).delete(`/student/${student2._id}`);

    expect(response.statusCode).toBe(200);
  });

  //TEST 16
  test("16 delete student by ID fail -- ID not found", async () => {
    const response = await request(app).delete(`/student/${student2._id}1`);

    expect(response.statusCode).toBe(404);
  });

  //TEST 16.2
  test("16.2 delete student by ID fail-- connection error", async () => {
    // מדמה שגיאת חיבור בזמן הפעלת Student.findOneAndDelete()

    stopConnection("findOneAndDelete");

    const response = await request(app).delete(`/student/${student1._id}`);

    //Connectiong back
    jest.restoreAllMocks();

    expect(response.statusCode).toBe(500);
  });

  //TEST 17
  test("17 Test get all students - one student", async () => {
    const response = await request(app).get("/student");
    expect(response.statusCode).toEqual(200);

    const data = response.body;
    expect(data.length).toEqual(1);

    const st = response.body[0];
    expect(st.name).toEqual(student3.name);
    expect(st._id).toEqual(student3._id);
  });
});
