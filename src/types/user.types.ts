import mongoose from "mongoose";

export interface friendsInterface {
  user: mongoose.Schema.Types.ObjectId;
  connected_on?: Date;
}

export interface userInterface {
  username: string;
  email: string;
  password: string;
  isGoogleAuth: boolean;
  friends: friendsInterface[];
  profile: {
    name: string;
    bio: string;
    profilePicture: string;
  };
}
