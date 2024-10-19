import mongoose, { Schema } from "mongoose";
import { splitInterface, splitUserInterface } from "../types/split.types";
import { UserDB } from "./user";
import { SplitAddedMail } from "../emails/email.templates";

export interface split extends mongoose.Document, splitInterface {
  //* Properties
  createdAt: Date;
  updatedAt: Date;

  //* Functions
  notify_all(): Promise<boolean>;
  //   notify_one(user_id: Schema.Types.ObjectId): Promise<boolean>;
  settle(): Promise<boolean>;
}

const splitSchema = new Schema<split>({
  //* Properties
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  splitWith: [
    {
      user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      percentage: {
        type: Number,
        max: 100,
        min: 0,
      },
      ispaid: {
        type: Boolean,
        default: false,
      },
      last_notification: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  settled: {
    type: Boolean,
    default: false,
  },
});

//? Post-save middleware [send notifications to all users]
// splitSchema.post("save", async function (doc) {
//   // Only trigger for newly created objects (not for updates)
//   if (doc.isNew && !doc.settled) {
//     await doc.notify_all();
//   }
// });

//? Functions
splitSchema.methods.notify_all = async function () {
  try {
    const users = this.splitWith
      .map((user: splitUserInterface) =>
        user.ispaid ? undefined : user.user_id
      )
      .filter((user: any) => user) as Schema.Types.ObjectId[];
    users.forEach(async (user_id) => {
      const user = await UserDB.findById(user_id);
      if (user) {
        SplitAddedMail(user, this.id);
      }
    });
    return true;
  } catch (error) {
    console.log("ERROR> While notifying all users,", error);
    return false;
  }
};

splitSchema.methods.settle = async function () {
  try {
    this.settled = true;
    this.save();
    return true;
  } catch (error) {
    console.log("ERROR> While settling split,", error);
    return false;
  }
};

export const SplitDB = mongoose.model<split>("Split", splitSchema);
