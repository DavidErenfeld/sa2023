import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).send("Token is null");
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req["user"] = verified;
    next();
  } catch (err) {
    return res.status(401).send("Token is invalid");
  }
};
export default authMiddleware;
