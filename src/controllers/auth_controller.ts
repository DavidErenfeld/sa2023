import { Request, Response } from "express";
import UserModel from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req: Request, res: Response) => {
  console.log("login");
  const email = req.body.email;
  const password = req.body.password;

  if (email == null || password == null) {
    return res.status(400).send("email or password is null");
  }

  try {
    const user = await UserModel.findOne({ email: email });
    if (user == null) {
      return res.status(400).send("bad email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("password is not match");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(200).send({ accessToken: token });
  } catch (err) {
    return res.status(500).send("server error");
  }
};

const logout = async (req: Request, res: Response) => {
  console.log("logout");
  res.status(400).send("logout");
};

const register = async (req: Request, res: Response) => {
  console.log("register");
  const email = req.body.email;
  const password = req.body.password;

  if (email == null || password == null) {
    return res.status(400).send("email or password is null");
  }

  try {
    const existUser = await UserModel.findOne({ email: email });
    if (existUser != null) {
      return res.status(400).send("email is exist");
    }
  } catch (err) {
    res.status(500).send("server error");
  }

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await UserModel.create({
      email: email,
      password: hashedPassword,
    });

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

export default { login, logout, register };
