import bcrypt from "bcrypt";
import { saltRounds } from "../config/env";
import { user, UserDB } from "../models/user";
import { StatusError } from "../types/types";
import { userOptions } from "../data/user.data";

export async function verifyUsername(username: string): Promise<boolean> {
  try {
    const user = await UserDB.findOne({ username });

    if (user) {
      return false;
    }

    const usernameRegex = /^[a-zA-Z0-9]{4,}$/;

    if (usernameRegex.test(username)) {
      return true;
    } else {
      const err = new Error("Invalid Username") as StatusError;
      err.statusCode = 400;
      throw err;
    }
  } catch (error) {
    throw error;
  }
}

export async function verifyEmail(email: string): Promise<boolean> {
  const user = await UserDB.findOne({ email });
  if (user) {
    return true;
  }
  return false;
}

export async function encodePassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

// export async function fetchUserData(
//   user: user,
//   fetch: string | undefined,
//   isuser: boolean = false,
// ): Promise<any> {
//   let data;
//   if (isuser) {
//     data = await user.userData();
//   } else {
//     data = await user.data();
//   }
//   if (fetch && fetch !== "all") {
//     if (!userOptions.options.includes(fetch)) {
//       const error = new Error("Invalid fetch request") as StatusError;
//       error.statusCode = 400;
//       throw error;
//     }
//     data = (data as any)[fetch];
//   }
//   return data;
// }