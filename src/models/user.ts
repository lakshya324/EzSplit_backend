import mongoose from "mongoose";
import { generateJwtToken } from "../utils/jwt";
import { comparePasswords } from "../utils/user";
import { userOptions } from "../data/user.data";
import { userInterface } from "../types/user.types";
import { defaultS3URL } from "../utils/aws.s3";

export interface user extends mongoose.Document, userInterface {
  //* Properties
  createdAt: Date;
  updatedAt: Date;

  //* Functions
  // globalData(): Promise<object>;
  data(): Promise<object>;
  verifyPassword(password: string): Promise<boolean>;
  generateJwtToken(): string;
}

const userSchema = new mongoose.Schema<user>({
  //* Properties
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: userOptions.textLength.username.min,
    maxlength: userOptions.textLength.username.max,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  isGoogleAuth: {
    type: Boolean,
    default: false,
  },
  friends: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      connected_on: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  profile: {
    name: {
      type: String,
      minlength: userOptions.textLength.title.min,
      maxlength: userOptions.textLength.title.max,
    },
    bio: {
      type: String,
      minlength: userOptions.textLength.description.min,
      maxlength: userOptions.textLength.description.max,
    },
    profilePicture: {
      type: String,
      default: `${defaultS3URL}/default/default_profile_picture.png`,
    },
  },
}, { timestamps: true });

//* Virtuals
// userSchema.virtual("profileUrl").get(function (this: user) {
//   return `https://lakshyasharma.tech/ezsplit/${this.username}`;
// });

//* Get Data Method
userSchema.methods.data = async function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    isGoogleAuth: this.isGoogleAuth,
    // friends: this.friends,
    profile: this.profile,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

//* Generate JWT Token Method
userSchema.methods.generateJwtToken = function () {
  return generateJwtToken(this._id.toString());
};

//* Verify Password Method
userSchema.methods.verifyPassword = async function (password: string) {
  if (!this.password) {
    return false;
  }
  return await comparePasswords(password, this.password);
};

export const UserDB = mongoose.model("User", userSchema);
