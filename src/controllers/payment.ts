import { Response, NextFunction } from "express";
import { AuthRequest, StatusError } from "../types/types";
import { user, UserDB } from "../models/user";
import { SplitDB } from "../models/split";
import { PaymentMail } from "../emails/email.templates";

export async function paySplit(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user! as user;
    const { splitId } = req.params;

    const split = await SplitDB.findById(splitId);
    if (!split) {
      const error = new Error("Split not found") as StatusError;
      error.statusCode = 404;
      throw error;
    }
    const createdby = await UserDB.findById(split.createdBy);
    if (!createdby) {
      const error = new Error("User not found") as StatusError;
      error.statusCode = 404;
      throw error;
    }

    let isExist = false;
    split.splitWith.forEach(async (friend) => {
      if (friend.user_id.toString() === user.id) {
        isExist = true;
        if (!friend.ispaid) {
          friend.ispaid = true;
        } else {
          const error = new Error("Already Paid") as StatusError;
          error.statusCode = 400;
          throw error;
        }
      }
    });
    if (!isExist) {
      const error = new Error("User not in Split") as StatusError;
      error.statusCode = 401;
      throw error;
    }

    PaymentMail(createdby, user);

    res.status(200).json({ success: true, message: "Payment Successful" });
  } catch (error) {
    next(error);
  }
}
