import express, { Express } from "express";
import dotenv from "dotenv";

const app = express();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import studentRoutes from "./routes/student_routes";
import studentPostRoutes from "./routes/student_post_routes";
import authRoutes from "./routes/auth_routes";

if (process.env.NODE_ENV == "test") {
  dotenv.config({ path: "./.testenv" });
} else {
  dotenv.config();
}

const initApp = () => {
  const db = mongoose.connection;
  db.on("error", (error) => console.error(error));
  db.once("open", () => console.log("Connected to Database"));
  return new Promise<Express>((resolve, reject) => {
    mongoose
      .connect(process.env.DB_URL)
      .then(() => {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use("/student", studentRoutes);
        app.use("/studentPost", studentPostRoutes);
        app.use("/auth", authRoutes);
        resolve(app);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export = initApp;
