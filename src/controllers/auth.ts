import { NextFunction, Response } from "express";
import { AuthRequest, StatusError } from "../types/types";
import { UserDB } from "../models/user";
import { validationResult } from "express-validator";
import { encodePassword, verifyEmail, verifyUsername } from "../utils/user";
import { newUserMail, userLoginMail } from "../emails/email.templates";

export async function signup(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await encodePassword(password);
    // validating input fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(
        `Validation Error! ${errors.array()[0].msg}`
      ) as StatusError;
      error.statusCode = 422;
      throw error;
    }
    // Validating if user already exists
    if (!(await verifyUsername(username))) {
      const error = new Error("Username already exists") as StatusError;
      error.statusCode = 409;
      throw error;
    }

    // Verifying email
    if (await verifyEmail(email)) {
      const error = new Error("Email already exists") as StatusError;
      error.statusCode = 409;
      throw error;
    }

    // Creating user
    const user = new UserDB({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    const token = user.generateJwtToken();

    // Sending welcome email
    newUserMail(user);

    res
      .status(201)
      .json({ success: true, message: "User created", data: { token, user } });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;
    // validating input fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(
        `Validation Error! ${errors.array()[0].msg}`
      ) as StatusError;
      error.statusCode = 422;
      throw error;
    }

    // Verifying user
    const user = await UserDB.findOne({ email });
    if (!user) {
      const error = new Error("Invalid Credentials") as StatusError;
      error.statusCode = 401;
      throw error;
    }

    // Verifying if user is Google Auth
    if (user.isGoogleAuth === true) {
        const error = new Error("Try using Google Auth") as StatusError;
        error.statusCode = 401;
        throw error;
    }

    // Verifying password
    const isMatch = await user.verifyPassword(password);
    if (!isMatch) {
      const error = new Error("Invalid Credentials") as StatusError;
      error.statusCode = 401;
      throw error;
    }

    const token = user.generateJwtToken();

    // sending login success Email
    userLoginMail(user);

    res
      .status(200)
      .json({ success: true, message: "Login success", data: { token, user } });
  } catch (error) {
    next(error);
  }
}