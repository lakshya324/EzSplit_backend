import { NextFunction, Response } from "express";
import { AuthRequest, StatusError } from "../types/types";
import { verifyJwtToken } from "../utils/jwt";
import { user, UserDB } from "../models/user";
// import { admin, AdminDB } from "../models/admin";

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const {id} = verifyJwtToken(req.get("Authorization"));

    let user: user | null;
    if (id) {
      user = await UserDB.findById(id);
      if (!user) {
        const error = new Error("User not found") as StatusError;
        error.statusCode = 404;
        throw error;
      }
    } else {
      const error = new Error("Bad Request") as StatusError;
      error.statusCode = 400;
      throw error;
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}


// export async function authAdminMiddleware(
//   req: AuthAdminRequest,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const {id} = verifyJwtToken(req.get("Authorization"));

//     let user: admin | null;
//     if (id) {
//       user = await AdminDB.findById(id);
//       if (!user) {
//         const error = new Error("User not found") as StatusError;
//         error.statusCode = 404;
//         throw error;
//       }
//       if (!user.isActive) {
//         const error = new Error("Unauthorized") as StatusError;
//         error.statusCode = 401;
//         throw error;
//       }
//     } else {
//       const error = new Error("Bad Request") as StatusError;
//       error.statusCode = 400;
//       throw error;
//     }
//     req.user = user;
//     next();
//   } catch (err) {
//     next(err);
//   }
// }